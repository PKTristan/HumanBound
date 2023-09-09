import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as circleActions from "../../store/circle";
import CircleCard from "../CircleCard";

import './CircleList.css';

const CircleList = () => {
    const dispatch = useDispatch();

    const circlesList = useSelector(circleActions.selCircles);

    const [circles, setCircles] = useState([]);
    const [name, setName] = useState('');

    useEffect(() => {
        dispatch(circleActions.getCircles({}));
    }, [dispatch]);

    useEffect(() => {
        if (circlesList && circlesList.circles !== undefined) {
            setCircles(circlesList.circles);
        }
    }, [circlesList]);

    const handleChange = (e) => {
        e.preventDefault();

        const { className, value } = e.target;

        const cName = className.slice(7);

        switch (cName) {
            case "name":
                setName(value);
                break;

            default:
                break;
        }
    }

    useEffect(() => {
        dispatch(circleActions.getCircles({ name }));
    }, [name]);

    return (
    <div className='circle-list'>
        <h1>HumanBound Circles</h1>

        <input type='text' className='search name' placeholder="Search by name" onChange={handleChange} value={name} />

        <CircleCard circles={circles} />
    </div>
    );
}

export default CircleList;
