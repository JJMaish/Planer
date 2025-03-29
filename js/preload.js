document.addEventListener('DOMContentLoaded', () => {
    const imagesToPreload = [
        'images/icons/landmarks.png',
        'images/icons/churches.png',
        'images/icons/museums.png',
        'images/attractions/belfry.jpg',
        'images/attractions/church-our-lady.jpg',
        'images/attractions/groeninge.jpg',
        'images/attractions/holy-blood.jpg'
    ];

    imagesToPreload.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}); 