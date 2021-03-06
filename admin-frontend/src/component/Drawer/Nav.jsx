import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import clsx from 'clsx';
import { Avatar, Badge } from '@material-ui/core';
import { useSelector, useDispatch } from 'react-redux';
import "./style.css"
import { userLogout } from '../../redux/auth';
import { withRouter, useHistory } from 'react-router-dom';
import route from "../../config/route";
import { countUnreadNotify } from '../../redux/notification';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

const MenuAppBar = (props) => {
    const classes = useStyles();
    const [auth, setAuth] = React.useState(true);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const { currentUser } = useSelector(state => state.user);
    const { unreadNotifyNumber , io } = useSelector(state => state.notify);
    const dispatch = useDispatch();
    const history = useHistory();


    useEffect(() => {

        if (currentUser?.id && io) {
            const data = { receiver_id: currentUser?.id }
            dispatch(countUnreadNotify(data))
        }
    }, [currentUser, io]);



    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const logout = () => {
        if(io) {
            dispatch(userLogout())

        }
    }

    const redirectToProfile = () => {
        history.push('/profile');
        setAnchorEl(null);
    }

    const redirectToAccountPage = () => {
        history.push('/account');
        setAnchorEl(null);
    }

    const toNotifiPage = () => {
        history.push('/notification');
    }

    return (
        <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={props.handleDrawerOpen}
                edge="start"
                className={clsx(classes.menuButton, {
                    [classes.hide]: open,
                })}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
                {route?.[props.match.path]?.label}
            </Typography>
            {auth && (
                <div>
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        color="inherit"
                    >
                        <Badge badgeContent={unreadNotifyNumber} max={100} color="secondary">
                            <Avatar alt="Remy Sharp" src={currentUser?.avatarurl} className={classes.large} />
                        </Badge>
                        <span className="username"> {currentUser?.fullname}</span>
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        keepMounted
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleClose}
                    >
                        <MenuItem onClick={() => redirectToProfile()}>Thông tin cá nhân</MenuItem>
                        <MenuItem onClick={() => toNotifiPage()}><span className = "highlight">{unreadNotifyNumber || ''} Thông báo</span></MenuItem>
                        <MenuItem onClick={() => redirectToAccountPage()}>Cài đặt</MenuItem>
                        <MenuItem onClick={logout}>Đăng xuất</MenuItem>
                    </Menu>
                </div>
            )}
        </Toolbar>
    );
}

export default withRouter(MenuAppBar);