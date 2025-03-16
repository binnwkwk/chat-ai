
import React, { useState } from "react";
import { motion } from "framer-motion";
import ModelSelector from "./ModelSelector";
import { UserSettings, ModelType } from "../utils/groq-client";

interface SettingsProps {
  settings: UserSettings;
  updateSettings: (settings: UserSettings) => void;
  models: ModelType[];
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
  settings,
  updateSettings,
  models,
  selectedModel,
  onSelectModel,
  darkMode,
  setDarkMode,
}) => {
  const [localSettings, setLocalSettings] = useState<UserSettings>(settings);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalSettings((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    updateSettings(localSettings);
  };

  const defaultAvatars = [
    "/avatars/avatar1.png",
    "/avatars/avatar2.png",
    "/avatars/avatar3.png",
    "/avatars/avatar4.png",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="p-4"
    >
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Theme</h3>
        <div className="flex items-center">
          <button
            onClick={() => setDarkMode(false)}
            className={`mr-3 p-3 rounded-md ${
              !darkMode ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Light
          </button>
          <button
            onClick={() => setDarkMode(true)}
            className={`p-3 rounded-md ${
              darkMode ? "bg-primary text-white" : "bg-gray-200 dark:bg-gray-700"
            }`}
          >
            Dark
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">AI Model</h3>
        <ModelSelector
          models={models}
          selectedModel={selectedModel}
          onSelectModel={onSelectModel}
        />
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">User Profile</h3>
        <div className="mb-4">
          <label className="block mb-1">Display Name</label>
          <input
            type="text"
            name="userName"
            value={localSettings.userName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Profile Image URL</label>
          <input
            type="text"
            name="userImage"
            value={localSettings.userImage}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Choose Avatar</label>
          <div className="grid grid-cols-4 gap-2 mt-1">
            {defaultAvatars.map((avatar, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => 
                  setLocalSettings((prev) => ({ ...prev, userImage: avatar }))
                }
                className={`p-1 rounded-md ${
                  localSettings.userImage === avatar ? "ring-2 ring-primary" : ""
                }`}
              >
                <img 
                  src={avatar} 
                  alt={`Avatar ${idx+1}`} 
                  className="w-12 h-12 rounded-full"
                />
              </motion.button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Bot Profile</h3>
        <div className="mb-4">
          <label className="block mb-1">AI Name</label>
          <input
            type="text"
            name="aiName"
            value={localSettings.aiName}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">AI Image URL</label>
          <input
            type="text"
            name="aiImage"
            value={localSettings.aiImage}
            onChange={handleChange}
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-md font-semibold mb-2">Prompt Settings</h3>
        <div className="mb-4">
          <label className="block mb-1">System Prompt</label>
          <textarea
            name="systemPrompt"
            value={localSettings.systemPrompt}
            onChange={(e) => 
              setLocalSettings((prev) => ({ 
                ...prev, 
                systemPrompt: e.target.value 
              }))
            }
            className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700 h-32"
            placeholder="Enter a system prompt to guide the AI's behavior..."
          />
        </div>
      </div>
      
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSave}
        className="w-full py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all"
      >
        Save Settings
      </motion.button>
    </motion.div>
  );
};

export default Settings;
