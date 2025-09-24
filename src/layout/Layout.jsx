import React from 'react'
import { Outlet } from 'react-router-dom';
import Footer from '../components/footer/Footer';
import Nav from './../components/nav/Nav';

export default function Layout() {
return (
    <div>
        <Nav />
        <Outlet/>
        <Footer />
    </div>
)
}
