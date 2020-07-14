
import InboxIcon from '@material-ui/icons/MoveToInbox';
import React, { useEffect } from 'react';
import MailIcon from '@material-ui/icons/Mail';
import AllInboxIcon from '@material-ui/icons/AllInbox';

const route = {
    '/' : {
        label: 'Quản lý gói',
        icon : <AllInboxIcon/>,
        visible: true
    },
    '/package/:id' : {
        label: 'Quản lý gói',
        icon : <AllInboxIcon/>
    },
    '/sample' : {
        label: 'Sample',
        icon : <InboxIcon/>,
        visible: true
    }
}



export default route;