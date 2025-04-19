import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { tripPlannerSchema, TripPlannerData } from "@shared/schema";

interface TripPlannerProps {
  onItineraryGenerated: (itineraryId: number) => void;
}

const TripPlanner = ({ onItineraryGenerated }: TripPlannerProps) => {
  const [selectedDuration, setSelectedDuration] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedTours, setSelectedTours] = useState<string[]>([]);
  
  const { toast } = useToast();
  
  const form = useForm<TripPlannerData>({
    resolver: zodResolver(tripPlannerSchema),
    defaultValues: {
      duration: "",
      interests: [],
      budget: "moderate",
      tours: [],
      additionalInfo: ""
    }
  });
  
  const itineraryMutation = useMutation({
    mutationFn: async (data: TripPlannerData) => {
      const response = await apiRequest("POST", "/api/itineraries", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Your personalized itinerary has been created.",
      });
      onItineraryGenerated(data.id);
      
      // Scroll to itinerary section
      document.getElementById("itinerary")?.scrollIntoView({ behavior: "smooth" });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create itinerary. Please try again.",
        variant: "destructive"
      });
    }
  });
  
  const onSubmit = (data: TripPlannerData) => {
    itineraryMutation.mutate(data);
  };
  
  // Toggle interest selection
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
      const updatedInterests = form.getValues().interests.filter(i => i !== interest);
      form.setValue("interests", updatedInterests, { shouldValidate: true });
    } else {
      setSelectedInterests([...selectedInterests, interest]);
      form.setValue("interests", [...form.getValues().interests, interest], { shouldValidate: true });
    }
  };
  
  // Toggle tour selection
  const toggleTour = (tour: string) => {
    if (selectedTours.includes(tour)) {
      setSelectedTours(selectedTours.filter(t => t !== tour));
      const updatedTours = form.getValues().tours.filter(t => t !== tour);
      form.setValue("tours", updatedTours, { shouldValidate: true });
    } else {
      setSelectedTours([...selectedTours, tour]);
      form.setValue("tours", [...form.getValues().tours, tour], { shouldValidate: true });
    }
  };
  
  // Set duration
  const setDuration = (duration: string) => {
    setSelectedDuration(duration);
    form.setValue("duration", duration, { shouldValidate: true });
  };
  
  // Set budget
  const setBudget = (budget: string) => {
    setSelectedBudget(budget);
    form.setValue("budget", budget as any, { shouldValidate: true });
  };
  
  return (
    <section id="plan" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Plan Your Perfect Bruges Trip</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tell us about your preferences, and our AI agent will create a personalized itinerary for your Bruges adventure.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                {/* Duration Picker */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <i className="fas fa-calendar-alt text-primary-600 mr-2"></i>
                    Duration of Your Stay
                  </h3>
                  <FormField
                    control={form.control}
                    name="duration"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { value: "1", label: "1 Day", desc: "Quick Visit" },
                            { value: "2", label: "2 Days", desc: "Weekend Trip" },
                            { value: "3", label: "3 Days", desc: "Extended Stay" },
                            { value: "4", label: "4+ Days", desc: "Full Experience" }
                          ].map((option) => (
                            <label 
                              key={option.value} 
                              className="duration-option cursor-pointer relative"
                            >
                              <input 
                                type="radio" 
                                name="duration" 
                                value={option.value} 
                                className="absolute opacity-0"
                                checked={selectedDuration === option.value}
                                onChange={() => setDuration(option.value)}
                              />
                              <div 
                                className={`border-2 ${selectedDuration === option.value ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'} rounded-lg p-4 text-center transition-colors duration-200`}
                              >
                                <span className="block text-lg font-medium">{option.label}</span>
                                <span className="text-sm text-gray-500">{option.desc}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Interest Selector */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <i className="fas fa-heart text-primary-600 mr-2"></i>
                    What Interests You?
                  </h3>
                  <FormField
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                          {[
                            { value: "History", icon: "fa-landmark" },
                            { value: "Culture", icon: "fa-palette" },
                            { value: "Food", icon: "fa-utensils" },
                            { value: "Shopping", icon: "fa-shopping-bag" },
                            { value: "Nature", icon: "fa-tree" },
                            { value: "Architecture", icon: "fa-archway" }
                          ].map((interest) => (
                            <label
                              key={interest.value}
                              className="interest-option cursor-pointer relative"
                            >
                              <input
                                type="checkbox"
                                name="interests"
                                value={interest.value}
                                className="absolute opacity-0"
                                checked={selectedInterests.includes(interest.value)}
                                onChange={() => toggleInterest(interest.value)}
                              />
                              <div
                                className={`border-2 ${selectedInterests.includes(interest.value) ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'} rounded-lg p-4 transition-colors duration-200`}
                              >
                                <div className="flex items-center">
                                  <i className={`fas ${interest.icon} text-gray-400 mr-3`}></i>
                                  <span className="font-medium">{interest.value}</span>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Budget Selection */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <i className="fas fa-coins text-primary-600 mr-2"></i>
                    Your Budget
                  </h3>
                  <FormField
                    control={form.control}
                    name="budget"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { value: "budget", label: "Budget", icon: "fa-wallet", desc: "Affordable options" },
                            { value: "moderate", label: "Moderate", icon: "fa-money-bill-wave", desc: "Mid-range choices" },
                            { value: "luxury", label: "Luxury", icon: "fa-gem", desc: "Premium experiences" }
                          ].map((budget) => (
                            <label
                              key={budget.value}
                              className="budget-option cursor-pointer relative"
                            >
                              <input
                                type="radio"
                                name="budget"
                                value={budget.value}
                                className="absolute opacity-0"
                                checked={selectedBudget === budget.value}
                                onChange={() => setBudget(budget.value)}
                              />
                              <div
                                className={`border-2 ${selectedBudget === budget.value ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'} rounded-lg p-4 text-center transition-colors duration-200`}
                              >
                                <i className={`fas ${budget.icon} text-2xl text-gray-400 mb-2`}></i>
                                <span className="block text-lg font-medium">{budget.label}</span>
                                <span className="text-sm text-gray-500">{budget.desc}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Tour Options */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <i className="fas fa-route text-primary-600 mr-2"></i>
                    Tour Options
                  </h3>
                  <FormField
                    control={form.control}
                    name="tours"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {[
                            { value: "canal", label: "Canal Tour", icon: "fa-water", desc: "See Bruges from the water" },
                            { value: "carriage", label: "Carriage Tour", icon: "fa-horse", desc: "Old-world charm" },
                            { value: "walking", label: "Walking Tour", icon: "fa-walking", desc: "Explore hidden corners" }
                          ].map((tour) => (
                            <label
                              key={tour.value}
                              className="tour-option cursor-pointer relative"
                            >
                              <input
                                type="checkbox"
                                name="tours"
                                value={tour.value}
                                className="absolute opacity-0"
                                checked={selectedTours.includes(tour.value)}
                                onChange={() => toggleTour(tour.value)}
                              />
                              <div
                                className={`border-2 ${selectedTours.includes(tour.value) ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-primary-300'} rounded-lg p-4 transition-colors duration-200`}
                              >
                                <div className="flex items-center">
                                  <i className={`fas ${tour.icon} text-gray-400 mr-3`}></i>
                                  <div>
                                    <span className="font-medium block">{tour.label}</span>
                                    <span className="text-sm text-gray-500">{tour.desc}</span>
                                  </div>
                                </div>
                              </div>
                            </label>
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Additional Info */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <i className="fas fa-comment-alt text-primary-600 mr-2"></i>
                    Additional Interests or Questions
                  </h3>
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us more about your interests, specific places you'd like to visit, or any questions you have about Bruges..."
                            rows={3}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-300 focus:border-primary-300 transition duration-200"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                  disabled={itineraryMutation.isPending}
                >
                  {itineraryMutation.isPending ? (
                    <><i className="fas fa-spinner fa-spin mr-2"></i> Generating...</>
                  ) : (
                    <><span>Generate My Personalized Itinerary</span><i className="fas fa-magic ml-2"></i></>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TripPlanner;
