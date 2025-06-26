import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import './TabsComponent.css';
import { Container, Nav, Navbar } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';

interface TabsComponentProps {
    links: Array<{
        title: string,
        relativeUrl: string
    }>

}

const TabsComponent: FC<TabsComponentProps> = ({ links }) => {



    const [activeKey, setActiveKey] = useState("home");
    const navigate = useNavigate();
    const location = useLocation(); // Get the current location object

    useEffect(() => { 
        setActiveKey(location.pathname)

    }, [])

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

    return (<Navbar className="TabsComponent" style={{ height: "40px" }}>
        <Container>
            <Nav activeKey={activeKey} onSelect={handleSelect}>
                {links.map((item) => (
                    <Nav.Link
                        key={item.relativeUrl} // Use relativeUrl as key for uniqueness
                        className="text-light"
                        onClick={(e) => handleNavigation(e, item.relativeUrl)}
                        eventKey={item.relativeUrl} // eventKey must match what activeKey will be
                    >
                        {item.title}
                    </Nav.Link>
                ))}
            </Nav>

        </Container>
    </Navbar>)
};

export default TabsComponent;
