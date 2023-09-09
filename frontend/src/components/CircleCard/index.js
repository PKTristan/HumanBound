import BookCard from "../BookCards";
import { useState } from "react";
import './CircleCard.css';

const CircleCard = ({circles}) => {
    const [isHidden, setIsHidden] = useState(true);
    const [id, setId] = useState(null);

    const handleClick = (id) => (e) => {
        e.preventDefault();

        setId(id);
        setIsHidden(!isHidden);
    }



    return (
        <div className='circle-cards'>
            {
                (circles && circles.length) ? circles.map(circle => (
                    <div classname='circle-card'>
                        <h4>{circle.name}</h4>
                        <h5>hosted by {circle.creator}</h5>
                        <button type='button' onClick={handleClick(circle.id)} hidden={!isHidden && (id === circle.id)} >Show Current Read</button>
                        <div className='pop-up' hidden={isHidden || id !== circle.id}>
                            <button type='button' onClick={handleClick(null)}>X</button>
                            <BookCard books={[circle.Book]}/>
                        </div>
                    </div>
                )) : null
            }
        </div>
    );
}


export default CircleCard;
