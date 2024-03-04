import React, { useState } from 'react'
import './entryFocused.css'
import Button from '../Button/Button'
import { ImParagraphJustify } from "react-icons/im";
import { FaRegNoteSticky } from "react-icons/fa6";
import { IoIosNotificationsOutline } from "react-icons/io";
import { MdOutlinePerson, MdOutlinePersonAddAlt} from "react-icons/md";
import { IoCalendarOutline } from "react-icons/io5";
import { IoIosCheckboxOutline } from "react-icons/io";
import { CgAttachment } from "react-icons/cg";
import Calendar from 'react-calendar';
import { GoBriefcase } from "react-icons/go";



function EntryFocused({applicationId}) {
    const [value, onChange] = useState(new Date());
  return (
    <div className='EntryFocused'>
      <div className="entry_focused_header">
        <div className="entry_focused_header_title">
            <h3>Microsoft SDE</h3>
        </div>
        <div className="entry_focused_header_buttons">
            <Button content={"X"} color={"black"}/>
        </div>
      </div>
      <div className="entry_focused_content">
        <div className="entry_focused_content_section">
            <div className="entry_focused_content_section_description">
                <div className="entry_focused_content_section_description_title">
                    <ImParagraphJustify/>
                    <h4>Description</h4>
                </div>
                <div className="entry_focused_content_section_description_entry">
                    <textarea placeholder="Detail your application description..."></textarea>
                </div>
            </div>

            <div className="entry_focused_content_section_notes">
                <div className="entry_focused_content_section_description_title">
                    <FaRegNoteSticky/>
                    <h4>Application Notes</h4>
                </div>
                <div className="entry_focused_content_section_description_entry">
                    <textarea placeholder="Include Notes..."></textarea>
                </div>
            </div>
            <Calendar value={value} onChange={onChange}/>
        </div>
        <div className="entry_focused_content_left_bar">
            <div className="entry_focused_content_left_bar_actions">
                <div className="entry_focused_content_left_bar_actions_title">
                    <h4>Actions</h4>
                </div>
                <div className="entry_focused_content_left_bar_actions_buttons">
                    <div className="entry_focused_content_left_bar_actions_buttons_button">
                        <IoIosNotificationsOutline/>
                        Notifications
                    </div>
                    <div className="entry_focused_content_left_bar_actions_buttons_button">
                        <MdOutlinePerson/>
                        Recommenders
                    </div>
                    <div className="entry_focused_content_left_bar_actions_buttons_button">
                        <IoCalendarOutline/>
                        Calendar
                    </div>
                </div>
            </div>

            <div className="entry_focused_content_left_bar_actions">
                <div className="entry_focused_content_left_bar_actions_title">
                    <h4>Add to card</h4>
                </div>
                <div className="entry_focused_content_left_bar_actions_buttons">
                    <div className="entry_focused_content_left_bar_actions_buttons_button">
                        <MdOutlinePersonAddAlt/>
                        New recommender
                    </div>
                    <div className="entry_focused_content_left_bar_actions_buttons_button">
                        <IoIosCheckboxOutline/>
                        Checklist
                    </div>
                    <div className="entry_focused_content_left_bar_actions_buttons_button">
                        <CgAttachment/>
                        Attachments
                    </div>
                    <div className="entry_focused_content_left_bar_actions_buttons_button">
                        <GoBriefcase/>
                        Recruiter
                    </div>

                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default EntryFocused
