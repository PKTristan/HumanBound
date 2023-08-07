import defaultImage from '../assets/no-book-found.png';
import defaultProfImg from '../assets/user.png';

export const isValidUrl = urlString => {
    try {
        return Boolean(new URL(urlString));
    }
    catch (e) {
        return false;
    }
};


export const setDefaultImg = (e) => {
    e.target.onerror = null;
    e.target.src = defaultImage;
}


export const setDefaultProfImg = (e) => {
    e.target.onerror = null;
    e.target.src = defaultProfImg;
}


export const getRandomNumber =(min, max) => {
    // Generate a random number between min (inclusive) and max (exclusive)
    // Using Math.random() * (max - min) + min
    const random = Math.random() * (max - min) + min;

    // Use Math.floor to get the whole number
    const randomInteger = Math.floor(random);

    // Return the random whole number
    return randomInteger;
}
