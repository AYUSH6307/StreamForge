import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    getStream,
    updateStream,
} from "../services/streamService";

function EditStream() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    useEffect(() => {

    const loadStream = async () => {

        try {

            const response = await getStream(id);

            setTitle(response.data.title);

            setDescription(response.data.description);

        } catch (error) {

            console.log(error);

        }

    };

    loadStream();

}, [id]);

    const handleUpdate = async (e) => {

        e.preventDefault();

        if (!title || !description) {

            alert("Please fill all fields.");

            return;

        }

        try {

            await updateStream(id, {
                title,
                description,
            });

            alert("Stream updated successfully!");

            navigate("/dashboard");

        } catch (error) {

            console.log(error);

            alert("Unable to update stream.");

        }

    };

    return (

        <div className="container mt-5">

            <div className="card p-4">

                <h2>Edit Stream</h2>

                <form onSubmit={handleUpdate}>

                    <div className="mb-3">

                        <label className="form-label">

                            Title

                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) =>
                                setTitle(e.target.value)
                            }
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">

                            Description

                        </label>

                        <textarea
                            className="form-control"
                            rows="4"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                        />

                    </div>

                    <button
                        className="btn btn-primary me-2"
                        type="submit"
                    >
                        Update Stream
                    </button>

                    <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={() => navigate("/dashboard")}
                    >
                        Cancel
                    </button>

                </form>

            </div>

        </div>

    );

}

export default EditStream;