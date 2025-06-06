import React, { FC } from 'react';
import './NotImplementedWarning.css';

interface NotImplementedWarningProps {
    message: string
}

const NotImplementedWarning: FC<NotImplementedWarningProps> = ({ message }) => (
    <div className="NotImplementedWarning">
        <div style={{ maxWidth: "800px", margin: "auto", textAlign: "center" }}>
            <h3>Not implemented yet</h3>
            <p>
                {message}
            </p>

        </div>

    </div>
);

export default NotImplementedWarning;
