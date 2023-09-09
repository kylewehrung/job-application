import React from "react";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

function UserAnswers() {
    const { userId } = useParams();
    const { state } = useLocation();
    const { answers } = state;

    // Access the answers object and render it!
    return (
        <div>
            <h1>User ID: {userId}</h1>
            <h2>Answers:</h2>
            <ul>
                {Object.keys(answers).map((questionId) => (
                    <li key={questionId}>
                        Question {questionId}: {answers[questionId]}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserAnswers;

