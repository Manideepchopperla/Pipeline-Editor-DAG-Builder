# 🧠 Pipeline Editor - DAG Builder 🚀  [Live Link](https://pipeline-editor-dag-builder.vercel.app/)

A **React-based visual editor** for creating and managing Directed Acyclic Graphs (DAGs). This tool simulates real-time data pipelines or processing workflows using interconnected nodes, offering features like node creation, edge drawing, validation, auto-layout, and more.

---

## 📌 Objective

The goal of this project is to build a visual Pipeline Editor using **React**, enabling users to:

- Add custom-labeled nodes.
- Create directional connections (edges) between nodes.
- Validate the pipeline as a proper DAG (no cycles, minimum two nodes, all connected).
- Delete nodes/edges with keyboard input.
- Auto-arrange nodes for better clarity.

---

## ⚙️ Features

- ✅ Visual DAG creation using `reactflow`
- ✅ Node & edge management (add, delete)
- ✅ DAG validation with real-time feedback
- ✅ Auto-layout using `dagre`
- ✅ Keyboard support (Delete key)
- ✅ JSON state preview for debugging
- ✅ Clean, modular React components

---

## 🛠️ Tech Stack

| Tool/Library       | Purpose                            |
|--------------------|------------------------------------|
| **React**          | Front-end framework                |
| **Vite**           | Fast React development setup       |
| **React Flow**     | Graph visualization                |
| **Dagre**          | Auto-layout algorithm              |
| **JavaScript**     | Language used for all logic        |

---

## 🚧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/Manideepchopperla/Pipeline-Editor-DAG-Builder.git
cd Pipeline-Editor-DAG-Builder
```

### 2. Install Dependencies
```bash
  npm install
```
### 3. Run the App
```bash
  npm run dev
```

## 🧩 Project Structure
```bash

📁 src
├── App.jsx                  # Main application file
├── components/
│   ├── CustomNode.jsx        
│   ├── NodeControls.jsx    
│   ├── PipelineEditor.jsx    
│   ├── ValidationIndicator.jsx    
│   └── ValidationStatus.jsx      
├── utils/
│   ├── layoutUtils.js            # Dagre layout logic
│   └── dagValidation.js        # DAG validation logic
└── index.css

```

## ✅ Core Functionalities & How They Work

### ➕ Add Node
- Click **"Add Node"** → enter a label → node appears on canvas.
- Node is assigned a **unique ID** and default position.

### 🔗 Draw Edges
- Drag from a node's **right handle** to another's **left handle**.
- Only source→target connections are allowed (no self-loops).

### ❌ Delete Nodes/Edges
- Select a node or edge and press the `Delete` key.
- Associated edges are cleaned up automatically.

### ✔️ DAG Validation
Validation triggers on any node/edge change:

| Validation Rule                  | ✔️ |
|----------------------------------|----|
| Minimum 2 nodes                  | ✅ |
| All nodes connected to edges     | ✅ |
| No cycles (DFS-based detection)  | ✅ |
| No self-loops                    | ✅ |

### 🧭 Auto Layout
- Click **"Auto Layout"** to automatically position nodes top-down.
- Uses `dagre` to compute layout, and `fitView()` for viewport adjustment.

---

## 🧪 Libraries Used

- [`reactflow`](https://reactflow.dev/)
- [`dagre`](https://github.com/dagrejs/dagre)
- [`vite`](https://vitejs.dev/)
- [`react-icons`](https://react-icons.github.io/react-icons/)

---

## 📸 Screen Recording

https://github.com/user-attachments/assets/355694b0-b980-46ae-9aa7-519656b380d6

---

## 🧗 Challenges Faced

- Implementing **cycle detection** using DFS and recursion stack.
- Maintaining **clean component structure** while managing `nodes` and `edges` state effectively.

