
import React from "react";
import { motion } from "framer-motion";
import { ModelType } from "../utils/groq-client";

interface ModelSelectorProps {
  models: ModelType[];
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({
  models,
  selectedModel,
  onSelectModel,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      <select
        value={selectedModel}
        onChange={(e) => onSelectModel(e.target.value)}
        className="block w-full py-2 px-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {models.map((model) => (
          <option key={model.id} value={model.id}>
            {model.name}
          </option>
        ))}
      </select>
    </motion.div>
  );
};

export default ModelSelector;
