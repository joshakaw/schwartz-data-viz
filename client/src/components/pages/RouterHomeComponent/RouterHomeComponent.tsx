import React, { FC, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap'; 
import './RouterHomeComponent.css';

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
                    <Card onClick={(e) => handleNavigation(e, "/signups")} style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '1rem', cursor: 'pointer', display: 'flex', textAlign: 'center' }} className="rounded">
                        <h3 style={{ paddingTop: '1rem' }}>Signups Summary</h3>
                        <p>View performance of advertising types used by Schwartz Tutoring</p>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card onClick={(e) => handleNavigation(e, "/detailedsignups")} style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '1rem', cursor: 'pointer', display: 'flex', textAlign: 'center' }} className="rounded">
                        <h3 style={{ paddingTop: '1rem' }}>Detailed Signups Summary</h3>
                        <p>View how users of Schwartz Tutoring began using our services, and which school they're from</p>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card onClick={(e) => handleNavigation(e, "/mailchimp")} style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '1rem', cursor: 'pointer', display: 'flex', textAlign: 'center' }} className="rounded">
                        <h3 style={{ paddingTop: '1rem' }}>Mailchimp</h3>
                        <p>View effectiveness of advertising campaigns and manage subscribers for our services</p>
                    </Card>
                </Col>
            </Row>
            <Row style={{ paddingTop: '2rem' }}>
                <Col md={4}>
                    <Card onClick={(e) => handleNavigation(e, "/tutor-data")} style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '1rem', cursor: 'pointer', display: 'flex', textAlign: 'center' }} className="rounded">
                        <h3 style={{ paddingTop: '1rem' }}>Tutor Details</h3>
                        <p>View performance of tutors working at Schwartz Tutoring</p>
                    </Card>
                </Col>
                <Col md={4}>
                    <Card onClick={() => window.open('https://github.com/joshakaw/schwartz-data-viz', '_blank')} style={{ background: 'linear-gradient(to bottom, #F5F5F5, #FFFFFF)', paddingBottom: '1rem', cursor: 'pointer', display: 'flex', textAlign: 'center' }} className="rounded">
                        <h3 style={{ paddingTop: '1rem' }}>GitHub Repository</h3>
                        <p>Look under the hood of the Schwartz Tutoring data analytics dashboard</p>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default RouterHomeComponent;
