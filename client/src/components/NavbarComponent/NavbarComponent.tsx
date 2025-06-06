import React, { FC, SyntheticEvent, useState } from 'react';
import './NavbarComponent.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router';

// https://react-bootstrap.netlify.app/docs/components/navbar
interface NavbarComponentProps { }

const NavbarComponent: FC<NavbarComponentProps> = () => {

    const [activeKey, setActiveKey] = useState("home");
    const navigate = useNavigate();

    /**
     * Alternative to 
     * <Nav.Link as={Link} to="[path]"></Nav.Link>
     * that adds a view transition.
     * @param e Event
     * @param path Path to navigate to
     */
    const handleNavigation = (e: React.MouseEvent<HTMLElement>,
        path: string) => {
        e.preventDefault()
        document.startViewTransition(() => {
            navigate(path);
        })
    }

    /**
     * Gives nav link the active style
     */
    function handleSelect(eventKey: string | null,
        e: SyntheticEvent<unknown, Event>): void {
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
                        <Nav.Link onClick={(e) => handleNavigation(e, "/")} eventKey="home">Home</Nav.Link>
                        <Nav.Link onClick={(e) => handleNavigation(e, "/mailchimp")} eventKey="mailchimp">Mailchimp</Nav.Link>
                        <Nav.Link onClick={(e) => handleNavigation(e, "/signups")} eventKey="signups">Signups</Nav.Link>
                        <Nav.Link onClick={(e) => handleNavigation(e, "/detailedsignups")} eventKey="detailedsignups">Detailed Signups</Nav.Link>
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