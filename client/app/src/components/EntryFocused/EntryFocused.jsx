import React, { useEffect, useState } from "react";
import "./entryFocused.css";
import Button from "../Button/Button";
import { ImParagraphJustify } from "react-icons/im";
import { FaRegNoteSticky } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlinePerson, MdOutlinePersonAddAlt } from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { IoIosCheckboxOutline } from "react-icons/io";
import { CgAttachment } from "react-icons/cg";
import Calendar from "react-calendar";
import { GoBriefcase } from "react-icons/go";
import axios from "axios";
import "react-calendar/dist/Calendar.css";

function EntryFocused({ entry, onClose }) {
  const [showRecruiterForm, setShowRecruiterForm] = useState(false);
  const [showRecommenderForm, setShowRecommenderForm] = useState(false);
  const [newRecruiter, setNewRecruiter] = useState("");
  const [newRecommender, setNewRecommender] = useState("");

  const handleRecruiterInputChange = (event) => {
    setNewRecruiter(event.target.value);
  };

  const handleRecommenderInputChange = (event) => {
    setNewRecommender(event.target.value);
  };

  const handleSaveRecruiter = () => {
    if (newRecruiter.trim() !== "") {
        console.log(currentEntry)
      var newRecuiters = currentEntry.recruiters;
      newRecuiters.push(newRecruiter);
      updateEntry((prev) => ({
        ...prev,
        recruiters: newRecuiters,
      }));

      setShowRecruiterForm(false);
      setNewRecruiter("");
    }
  };

  const handleSaveRecommender = () => {
    if (newRecommender.trim() !== "") {
      // Add logic to update currentEntry with new recommender
      setShowRecommenderForm(false);
      setNewRecommender("");
    }
  };

  const handleCancelRecruiter = () => {
    setShowRecruiterForm(false);
    setNewRecruiter("");
  };

  const handleCancelRecommender = () => {
    setShowRecommenderForm(false);
    setNewRecommender("");
  };

  const handleAddRecruiterClick = () => {
    setShowRecruiterForm(true);
  };

  const handleAddRecommenderClick = () => {
    setShowRecommenderForm(true);
  };
  const [value, onChange] = useState(new Date());
  const [currentEntry, updateEntry] = useState(entry);

  //Everything with the task logic
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTask, setNewTask] = useState("");
  const handleTaskInputChange = (event) => {
    setNewTask(event.target.value);
  };

  const handleSaveTask = () => {
    if (newTask.trim() !== "") {
      var newTasks = currentEntry.tasks;
      newTasks.push(newTask);
      updateEntry((prev) => ({
        ...prev,
        tasks: newTasks,
      }));
      setShowTaskForm(false);
      setNewTask("");
    }
  };

  const handleCancelTask = () => {
    setShowTaskForm(false);
    setNewTask("");
  };

  const handleAddTaskClick = () => {
    setShowTaskForm(true);
  };
  const toggleNotifications = () => {
    updateEntry((prev) => ({
      ...prev,
      notifications: !prev.notifications,
    }));
  };

  const handleDescriptionChange = (event) => {
    updateEntry((prev) => ({
      ...prev,
      description: event.target.value,
    }));
  };

  const handleNotesChange = (event) => {
    updateEntry((prev) => ({
      ...prev,
      notes: event.target.value,
    }));
  };
  useEffect(() => {
    try {
      console.log("Attempting update: ", currentEntry);
      // Post new entry data to the application
      axios.put(
        "http://localhost:5555/application/" + currentEntry.applicationId,
        currentEntry
      );
      console.log("Entry:  updated successfully");
    } catch (error) {
      console.error(
        "Error submitting new entry:",
        error.message,
        "for entry ",
        currentEntry
      );
    }
  }, [currentEntry]);
  return (
    <div className="EntryFocused">
      <div className="entry_focused_header">
        <div className="entry_focused_header_title">
          <h3>{entry.jobTitle}</h3>
          <h4>{entry.company}</h4>
        </div>
        <div className="entry_focused_header_buttons">
          <Button content={"X"} color={"black"} onClick={onClose} />
        </div>
      </div>
      <div className="entry_focused_content">
        <div className="entry_focused_content_section">
          <div className="entry_focused_content_section_description">
            <div className="entry_focused_content_section_description_title">
              <ImParagraphJustify />
              <h4>Description</h4>
            </div>
            <div className="entry_focused_content_section_description_entry">
              <textarea
                onChange={handleDescriptionChange}
                placeholder="Include Description..."
              >
                {currentEntry.description}
              </textarea>
            </div>
          </div>

          <div className="entry_focused_content_section_notes">
            <div className="entry_focused_content_section_description_title">
              <FaRegNoteSticky />
              <h4>Application Notes</h4>
            </div>
            <div className="entry_focused_content_section_description_entry">
              <textarea
                placeholder="Include Notes..."
                onChange={handleNotesChange}
              >
                {currentEntry.notes}
              </textarea>
            </div>
          </div>

          <div className="entry_focused_content_section_bottom">
            <div className="entry_focused_content_section_calendar">
              <h3>Schedule preview</h3>
              <Calendar
                className="calendar"
                value={value}
                onChange={onChange}
              />
            </div>

            <div className="entry_focused_content_section_checklist">
              <h3>Checklist</h3>
              <ul>
                {currentEntry.tasks.map((item) => (
                  <li>
                    <label>
                      <input
                        type="checkbox"
                        checked={item.endsWith("checked")}
                      />
                      {item}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="entry_focused_content_left_bar">
          <div className="entry_focused_content_left_bar_actions">
            <div className="entry_focused_content_left_bar_actions_title">
              <h4>Actions</h4>
            </div>
            <div className="entry_focused_content_left_bar_actions_buttons">
              <div
                className="entry_focused_content_left_bar_actions_buttons_button"
                style={{
                  backgroundColor: currentEntry.notifications
                    ? "rgb(173, 175, 178)"
                    : "",
                }}
                onClick={toggleNotifications}
              >
                <IoIosNotificationsOutline />
                Notifications
              </div>

              <div className="entry_focused_content_left_bar_actions_buttons_button">
                <MdOutlinePerson />
                Share
              </div>
              <div className="entry_focused_content_left_bar_actions_buttons_button">
                <IoCalendarOutline />
                Sync to Calendar
              </div>
            </div>
          </div>

          <div className="entry_focused_content_left_bar_actions">
            <div className="entry_focused_content_left_bar_actions_title">
              <h4>Add to card</h4>
            </div>
            <div className="entry_focused_content_left_bar_actions_buttons">
              {currentEntry.type === "COLLEGE" && (
                <div
                  className="entry_focused_content_left_bar_actions_buttons_button"
                  onClick={handleAddRecommenderClick}
                >
                  <MdOutlinePersonAddAlt />
                  New recommender
                </div>
              )}

              {showRecommenderForm && (
                <div className="new-recommender-form">
                  <input
                    type="text"
                    value={newRecommender}
                    onChange={handleRecommenderInputChange}
                    placeholder="Enter recommender..."
                  />
                  <div className="recommender-form-buttons">
                    <button onClick={handleSaveRecommender}>Save</button>
                    <button onClick={handleCancelRecommender}>Cancel</button>
                  </div>
                </div>
              )}

              <div
                className="entry_focused_content_left_bar_actions_buttons_button"
                onClick={handleAddTaskClick}
              >
                <IoIosCheckboxOutline />
                Add task
              </div>

              {showTaskForm && (
                <div className="new-task-form">
                  <input
                    type="text"
                    value={newTask}
                    onChange={handleTaskInputChange}
                    placeholder="Enter task..."
                  />
                  <div className="task-form-buttons">
                    <button onClick={handleSaveTask}>Save</button>
                    <button onClick={handleCancelTask}>Cancel</button>
                  </div>
                </div>
              )}
              <div className="entry_focused_content_left_bar_actions_buttons_button">
                <CgAttachment />
                Attachments
              </div>
              {currentEntry.type === "JOB" && (
                <div
                  className="entry_focused_content_left_bar_actions_buttons_button"
                  onClick={handleAddRecruiterClick}
                >
                  <GoBriefcase />
                  Add recruiter
                </div>
              )}

              {showRecruiterForm && (
                <div className="new-recruiter-form">
                  <input
                    type="text"
                    value={newRecruiter}
                    onChange={handleRecruiterInputChange}
                    placeholder="Enter recruiter..."
                  />
                  <div className="recruiter-form-buttons">
                    <button onClick={handleSaveRecruiter}>Save</button>
                    <button onClick={handleCancelRecruiter}>Cancel</button>
                  </div>
                </div>
              )}
            </div>

            <div className="entry_focused_content_left_bar_actions_title">
              <h4>People</h4>
            </div>
            <div className="entry_focused_content_left_bar_actions_buttons">
              {currentEntry.type === "JOB" && currentEntry.recruiters && (
                <>
                  {currentEntry.recruiters.map((recruiter) => (
                    <div
                      className="entry_focused_content_left_bar_actions_buttons_button"
                    >
                      <GoBriefcase />
                      {recruiter}
                    </div>
                  ))}
                </>
              )}
              {currentEntry.type === "COLLEGE" && currentEntry.recommenders && (
                <>
                  {currentEntry.recommenders.map((recommender) => (
                    <div
                      className="entry_focused_content_left_bar_actions_buttons_button"
                    >
                      <MdOutlinePersonAddAlt />
                      {recommender}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntryFocused;
