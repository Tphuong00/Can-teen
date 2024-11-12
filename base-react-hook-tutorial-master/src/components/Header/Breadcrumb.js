import React from 'react';
import { Link } from 'react-router-dom';
import  './Breadcrumb.scss' ;


const Breadcrumb =(props)=> {
  // items là một mảng chứa các đối tượng đường dẫn
  const { items = [] } = props;  
    return (
        <nav aria-label="breadcrumb">
            <div className="breadcrumb breadcrumb-nav">
                {items.map((item, index) => (
                    <li
                        key={index}
                        className={`breadcrumb-item ${index === items.length - 1 ? 'active' : ''}`}
                        aria-current={index === items.length - 1 ? 'page' : undefined}
                    >
                        {index === items.length - 1 ? (
                            item.label
                        ) : (
                            <Link className="item-breadcrum" to={item.link}>{item.label}</Link>
                        )}
                    </li>
                ))}
            </div>
        </nav>
    );
}


export default Breadcrumb;