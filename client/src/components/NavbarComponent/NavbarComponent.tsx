import React, { FC, SyntheticEvent, useState } from 'react';
import './NavbarComponent.css';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router';
import NavDropdown from 'react-bootstrap/NavDropdown';

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
                <Nav.Link className="text-light" onClick={(e) => handleNavigation(e, "/")} eventKey="home">
                    <Navbar.Brand href="#home">
                        {/*Schwartz Tutoring*/}
                        <img src="/schwartz-tutoring-logo.svg" width="100px"></img>
                    </Navbar.Brand>
                </Nav.Link>

                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto links" activeKey={activeKey} onSelect={handleSelect}>
                        <Nav.Link className="text-light" onClick={(e) => handleNavigation(e, "/mailchimp")} eventKey="mailchimp">Mailchimp</Nav.Link>
                        <Nav.Link className="text-light" onClick={(e) => handleNavigation(e, "/accounts-receivable")} eventKey="">Accounts Receivable</Nav.Link>
                        <Nav.Link className="text-light" onClick={(e) => handleNavigation(e, "/tutor-data")} eventKey="">Tutor Data</Nav.Link>
                        
                        
                        <NavDropdown title="Signups" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">
                                <Nav.Link className="text-dark" onClick={(e) => handleNavigation(e, "/signups")} eventKey="signups">Limited</Nav.Link>
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                                <Nav.Link className="text-dark" onClick={(e) => handleNavigation(e, "/detailedsignups")} eventKey="detailedsignups">Detailed</Nav.Link>
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
};

export default NavbarComponent;