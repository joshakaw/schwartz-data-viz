import React, { FC, SyntheticEvent, useEffect, useState } from 'react';
import './RouterHomeComponent.css';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';

interface RouterHomeComponentProps { }

const RouterHomeComponent: FC<RouterHomeComponentProps> = () => {

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

    return (
        <Container>
            <Row style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '5rem' }} className="rounded">
                <h1>Welcome to the Schwartz Tutoring Data Analytics Dashboard!</h1>
                <p>This website is designed to help visualize company data on multiple dashboards, including signup, customer, and tutor metrics.</p>
            </Row>
            <Row>
                <Col md={4}>
                    <Card onClick={(e) => handleNavigation(e, "/signups")} style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '5rem' }} className="rounded">
                        <h3 style={{ paddingLeft: '0.2rem' }}>Signups Summary</h3>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card onClick={(e) => handleNavigation(e, "/detailedsignups")} style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '5rem' }} className="rounded">
                        <h3 style={{ paddingLeft: '0.2rem' }}>Detailed Signups Summary</h3>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card onClick={(e) => handleNavigation(e, "/mailchimp")} style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '5rem' }} className="rounded">
                        <h3 style={{ paddingLeft: '0.2rem' }}>Mailchimp</h3>
                    </Card>
                </Col>
            </Row>
            <Row style={{ paddingTop: '2rem' }}>
                <Col md={4}>
                    <Card onClick={(e) => handleNavigation(e, "/tutor-data")} style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '5rem' }} className="rounded">
                        <h3 style={{ paddingLeft: '0.2rem' }}>Tutor Details</h3>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card onClick={() => window.open('https://github.com/joshakaw/schwartz-data-viz', '_blank')} style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '5rem' }} className="rounded">
                        <h3 style={{ paddingLeft: '0.2rem' }}>GitHub Repository</h3>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RouterHomeComponent;
