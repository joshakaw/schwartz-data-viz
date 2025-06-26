'use export';

import { Row, Col } from 'react-bootstrap';
import { FC } from 'react';
import { SignupSummaryBoxResponseDTO } from '../../dtos/SignupSummaryBoxResponseDTO';

interface SummaryProps {
    sData: {
        lastWeek: number;
        thisWeek: number;
    }
};

const SummaryBox: FC<SummaryProps> = ({ sData }) => {
  return (
      <div>
          <Row>
              <Col>
                  <p className="text-center">Total signups last week:</p>
                  <h1 className="text-center">{sData.lastWeek}</h1>
              </Col>
              <Col>
                  <p className="text-center">Total signups this week:</p>
                  <h1 className="text-center">{sData.thisWeek}</h1>
              </Col>
          </Row>
      </div>
  );
}

export default SummaryBox;