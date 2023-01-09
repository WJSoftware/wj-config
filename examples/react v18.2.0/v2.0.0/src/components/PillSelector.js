import { Fragment, useState } from 'react';
import './PillSelector.css';

function Pill(props) {
    const onClick = () => {
        props.onClick(props.id);
    };
    return <div className={(props.selected ? 'selected' : '')}>
        <button
            onClick={onClick}
        >
            {props.title}
        </button>
    </div>
}

export default function PillSelector(props) {
    const [selIndex, setSelIndex] = useState(props.selectedIndex);
    const onPillClick = id => {
        const newSelIndex = props.items.findIndex(x => x.id === id);
        setSelIndex(newSelIndex);
        const onSelectionChange = props.onSelectionChange ?? (() => { });
        console.log('About to run onSelectionChange.');
        onSelectionChange(props.items[newSelIndex]);
    };
    return <div className="pill-selector">
        {props.title && <Fragment><h5>{props.title}</h5><br /></Fragment>}
        {props.items.map((it, index) => <Pill key={it.id} title={it.name} id={it.id} onClick={onPillClick} selected={index === selIndex} />)}
        {props.children}
    </div >
};
