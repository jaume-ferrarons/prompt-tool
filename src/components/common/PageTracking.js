import React, {useEffect} from 'react';
import { useLocation } from 'react-router-dom';

import {pageView} from "../../services/analytics";

const PageTracking = () => {
    const location = useLocation();
          
    useEffect(() => {
      pageView(location.pathname);
    }, [location])

    return <></>;
}

export default PageTracking;