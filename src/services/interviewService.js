const API_URL = "http://localhost:3000";

export const interviewService = {
    createSession: async (userId, topic) => {
        try {
            const response = await fetch(`${API_URL}/interview/create-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId, topic }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to create interview session");
            }

            return data;
        } catch (error) {
            throw error;
        }
    },

    getFeedbackHistory: async (userId) => {
        try {
            const response = await fetch(`${API_URL}/interview/feedback/${userId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Basic " + btoa("fyp:fyp")
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch feedback history");
            }

            return data;
        } catch (error) {
            throw error;
        }
    },
};
