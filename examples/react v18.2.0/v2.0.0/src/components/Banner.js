import React from "react";
import bannerTypes from "./banner-types.js";
import { FaAward, FaHandsHelping } from "react-icons/fa";
import './Banner.css';

function typeText(type) {
    switch (type) {
        case bannerTypes.Tip:
            return 'Tip';
        case bannerTypes.Collab:
            return 'Collaboration Wanted'
    }
    return null;
}

function typeIcon(type) {
    switch (type) {
        case bannerTypes.Tip:
            return <FaAward />
        case bannerTypes.Collab:
            return <FaHandsHelping />
    }
}

function Banner(props) {
    let clsName = 'banner';
    if (props.inline) {
        clsName += ' inline'
    }
    return <div className={clsName}>
        <h4>{typeIcon(props.type)} {typeText(props.type)}</h4>
        {props.children}
    </div>
}

export default Banner;
