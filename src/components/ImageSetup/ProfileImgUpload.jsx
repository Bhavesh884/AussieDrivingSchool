import React, { useState } from "react";
import { FaCamera, FaEdit } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import Modal from "./Modal";
import ImageUploader from "./ImageUploader";
import { handleUploadImage } from "./HandleImageUpload";

//update profile Image
export const ProfileImgUpload = ({profileImg,setProfileImg,updateProfileImage}) =>{
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
        setShowModal(true);
      };
      // reader.readAsDataURL(file);
      reader.readAsDataURL(event.target.files[0]);
      setShowEditOptions(false);
    }
  };

  const handleCroppedImage = (url) => {
    console.log("Cropped image URL:", url);
    setShowModal(false); // Close the modal after getting the URL
    setProfileImg(url); // Reset the image state
    updateProfileImage(url);
  };

  const closeModal = () => {
    setShowModal(false);
    setProfileImg(null); // Reset the image state when modal is closed
  };

  const handleRemoveImage = () => {
    setProfileImg(null);
    setShowEditOptions(false);
    updateProfileImage(null);
  };

  const toggleEditOptions = () => {
    setShowEditOptions((prev) => !prev);
  };
  return (
    <div>
       <div className="flex justify-center">
            <div className={`relative ${(location.pathname === "/visitorform" || location.pathname === "/learnersignup") ? "h-24 w-24" : "w-20 h-20"} mb-5`}>
              {/* Profile Image or Placeholder */}
              <label
                // htmlFor="profile-pic-upload"
                className="relative w-full h-full rounded-full overflow-hidden cursor-pointer"
              >
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="object-cover w-full h-full rounded-full shrink-0"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-full">
                    <FaCamera className="text-gray-500" size={24} />
                  </div>
                )}
              </label>

              {/* Edit Icon */}
              <div
                onClick={toggleEditOptions}
                className="absolute bottom-1 right-3 bg-gray-200 p-1 rounded-full cursor-pointer shadow-md hover:bg-gray-300 h-5 w-5 flex items-center"
              >
                <MdEdit className="text-gray-600" />
              </div>
              {/* Edit Options Dropdown */}
              {showEditOptions && (
                <div className="absolute left-20 bottom-3 transform translate-y-full mt-2 bg-white border border-gray-300 rounded shadow-lg p-1 w-40">
                  {!profileImg ? (
                    <button
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                      onClick={() =>
                        document.getElementById("profile-pic-upload").click()
                      }
                    >
                      Upload Image
                    </button>
                  ) : (
                    <>
                      <button
                        className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                        onClick={() =>
                          document.getElementById("profile-pic-upload").click()
                        }
                      >
                        Upload Other Image
                      </button>
                      <button
                        className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-500 text-sm"
                        onClick={handleRemoveImage}
                      >
                        Remove Image
                      </button>
                    </>
                  )}
                </div>
              )}
              {/* Hidden File Input */}
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <Modal
            className="w-full h-full overflow-scroll"
            show={showModal}
            onClose={closeModal}
          >
            <ImageUploader
              image={profileImg}
              handleUploadImage={handleUploadImage}
              filename="cropped_image.jpg"
              onCropped={handleCroppedImage}
              aspectRatio={16 / 9} // Change this to 1 for square, 16/9 for landscape, or 9/16 for portrait
            />
          </Modal>
    </div>
  )
}

//upload profile image
export const SetProfileImg = ({profileImg,setProfileImg}) =>{
  const [showEditOptions, setShowEditOptions] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
        setShowModal(true);
      };
      // reader.readAsDataURL(file);
      reader.readAsDataURL(event.target.files[0]);
      setShowEditOptions(false);
    }
  };

  const handleCroppedImage = (url) => {
    console.log("Cropped image URL:", url);
    setShowModal(false); // Close the modal after getting the URL
    setProfileImg(url); // Reset the image state
  };

  const closeModal = () => {
    setShowModal(false);
    setProfileImg(null); // Reset the image state when modal is closed
  };

  const handleRemoveImage = () => {
    setProfileImg(null);
    setShowEditOptions(false);
  };

  const toggleEditOptions = () => {
    setShowEditOptions((prev) => !prev);
  };
  return (
    <div>
       <div className="flex justify-center">
            <div className={`relative ${(location.pathname === "/visitorform" || location.pathname === "/learnersignup") ? "h-24 w-24" : "w-20 h-20"} mb-5`}>
              {/* Profile Image or Placeholder */}
              <label
                // htmlFor="profile-pic-upload"
                className="relative w-full h-full rounded-full overflow-hidden cursor-pointer"
              >
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="Profile"
                    className="object-cover w-full h-full rounded-full shrink-0"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full bg-gray-100 rounded-full">
                    <FaCamera className="text-gray-500" size={24} />
                  </div>
                )}
              </label>

              {/* Edit Icon */}
              <div
                onClick={toggleEditOptions}
                className="absolute bottom-1 right-3 bg-gray-200 p-1 rounded-full cursor-pointer shadow-md hover:bg-gray-300 h-5 w-5 flex items-center"
              >
                <MdEdit className="text-gray-600" />
              </div>
              {/* Edit Options Dropdown */}
              {showEditOptions && (
                <div className="absolute left-20 bottom-3 transform translate-y-full mt-2 bg-white border border-gray-300 rounded shadow-lg p-1 w-40">
                  {!profileImg ? (
                    <button
                      className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                      onClick={() =>
                        document.getElementById("profile-pic-upload").click()
                      }
                    >
                      Upload Image
                    </button>
                  ) : (
                    <>
                      <button
                        className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-sm"
                        onClick={() =>
                          document.getElementById("profile-pic-upload").click()
                        }
                      >
                        Upload Other Image
                      </button>
                      <button
                        className="block w-full text-left px-2 py-1 hover:bg-gray-100 text-red-500 text-sm"
                        onClick={handleRemoveImage}
                      >
                        Remove Image
                      </button>
                    </>
                  )}
                </div>
              )}
              {/* Hidden File Input */}
              <input
                id="profile-pic-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          <Modal
            className="w-full h-full overflow-scroll"
            show={showModal}
            onClose={closeModal}
          >
            <ImageUploader
              image={profileImg}
              handleUploadImage={handleUploadImage}
              filename="cropped_image.jpg"
              onCropped={handleCroppedImage}
              aspectRatio={16 / 9} // Change this to 1 for square, 16/9 for landscape, or 9/16 for portrait
            />
          </Modal>
    </div>
  )
}
