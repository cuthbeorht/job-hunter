import { useState } from "react";
import { addExperienceItem } from "../../../api/jobs";

export default function ExperienceItems() {
    
    const [newExperienceItem, setNewExperienceItem] = useState("");
    const [hint, setHint] = useState("");

    function handleExperienceChange(event: React.ChangeEvent<HTMLInputElement>) {
        setNewExperienceItem(event.target.value);
    }

    async function handleSubmit() {
        // Here you would typically send the new experience item to your backend API
        console.log("New Experience Item:", newExperienceItem);
        if (newExperienceItem.trim() === "") {
            setHint("Experience item cannot be empty.");
            return;
        }
        console.debug("Submitting new experience item:", newExperienceItem);
        await addExperienceItem(newExperienceItem);
        setNewExperienceItem(""); // Clear the input after submission
    }
    
  
    return (
        <div className="">
            <h2>Experience Items</h2>
            <p>Here you can manage your experience items.</p>
            <label htmlFor="experience">Experience:</label>
            <input type="text" placeholder = {hint} id="experience" name="experience" value={newExperienceItem} onChange={handleExperienceChange} />
            <button className="" onClick={handleSubmit}>Add Experience</button>
        </div>
    );
}