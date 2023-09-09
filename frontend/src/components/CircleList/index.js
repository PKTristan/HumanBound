import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as circleActions from "../../store/circle";
import CircleCard from "../CircleCard";

const CircleList = () => {
    const dispatch = useDispatch();

    const circlesList = useSelector(circleActions.selCircles);

    const [circles, setCircles] = useState([]);

    useEffect(() => {
        dispatch(circleActions.getCircles());
    }, [dispatch]);

    useEffect(() => {
        if (circlesList && circlesList.circles !== undefined) {
            setCircles(circlesList.circles);
        }
    }, [circlesList]);

    return (
    <div className='circle-list'>
        <h1>HumanBound Circles</h1>

        <input type='text' className='search name' placeholder="Search by name" />
        <input type='text' className='search creator' placeholder="Search by creator" />

        <CircleCard circles={circles} />
    </div>
    );
}

export default CircleList;
