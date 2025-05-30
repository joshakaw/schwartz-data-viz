import React, { FC, SyntheticEvent, useState } from 'react';
import './NavbarComponent.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { LinkContainer } from 'react-router-bootstrap';
import { Link } from 'react-router';

// https://react-bootstrap.netlify.app/docs/components/navbar
interface NavbarComponentProps { }

const NavbarComponent: FC<NavbarComponentProps> = () => {

    const [activeKey, setActiveKey] = useState("home");

    function handleSelect(eventKey: string | null, e: SyntheticEvent<unknown, Event>): void {
        if (eventKey) {
            setActiveKey(eventKey);
        }
    }

    return (
        <Navbar expand="lg" className="app-navbar-schwartz-bg">
            <Container>
                <Navbar.Brand href="#home">
                    {/*Schwartz Tutoring*/}
                    <img src="/schwartz-tutoring-logo.svg" width="100px"></img>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" activeKey={activeKey} onSelect={handleSelect}>
                        <Nav.Link as={Link} to="/" eventKey="home">Home</Nav.Link>
                        <Nav.Link as={Link} to="/signups" eventKey="signups">Signups</Nav.Link>
                        <Nav.Link as={Link} to="/mailchimp" eventKey="mailchimp">Mailchimp Export</Nav.Link>
                        {/*<NavDropdown title="Dropdown" id="basic-nav-dropdown">*/}
                        {/*    <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.2">*/}
                        {/*        Another action*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*    <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>*/}
                        {/*    <NavDropdown.Divider />*/}
                        {/*    <NavDropdown.Item href="#action/3.4">*/}
                        {/*        Separated link*/}
                        {/*    </NavDropdown.Item>*/}
                        {/*</NavDropdown>*/}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
};

export default NavbarComponent;