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
