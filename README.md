# **Schwartz Tutoring: Data Visualization Project**

Our team will develop a website for Schwartz Tutoring to visualize company data on multiple dashboards, including signup, customer, and tutor metrics. This README will guide you through getting the project up and running.

---

## **Technologies Used**

* **Backend:** Python 3.11 with Flask
* **Frontend:** React.js
* **Development Environment:** Visual Studio Community IDE

---

## **Prerequisites**

Before you begin, ensure you have the following installed:

* **Visual Studio Community IDE:** This is our primary development environment.
    * Download from [visualstudio.microsoft.com/vs/community/](https://visualstudio.microsoft.com/vs/community/)
* **Python 3.11:**
    * Download from [python.org/downloads/release/python-3110/](https://www.python.org/downloads/release/python-3110/)
* **Node.js & npm:**
    * Download from [nodejs.org/en/download](https://nodejs.org/en/download)

---

## **Setup Instructions**

Follow these steps to get the project running on your local machine.

### **1. Install Visual Studio Community**

If you don't have Visual Studio Community installed:

1.  **Download and Run Installer:**
    * Go to [visualstudio.microsoft.com/vs/community/](https://visualstudio.microsoft.com/vs/community/) and download the Visual Studio Community installer.
    * Run the installer.
2.  **Install:** Follow the installer prompts to complete the installation. Make sure to install the `Python development` workload and select the optional component `Python Web Support`.

### **2. Open the Project in Visual Studio**

1.  **Open Visual Studio Community.**
2.  When Visual Studio first starts, you'll often see a "Get started" or "Start window." Look for an option like **"Open a project or solution"** or **"Clone a repository."**
3.  If you have the project files already downloaded (e.g., from a zip file or a previous clone), choose **"Open a project or solution..."** and navigate to the root directory of your project (`schwartz-data-viz`). Select the `.sln` (solution) file.
4.  If you need to clone the repository directly from Visual Studio, choose **"Clone a repository."** You'll be prompted to enter the repository URL: `https://github.com/joshakaw/schwartz-data-viz.git` and a local path where you want to save it. Visual Studio will then clone the repository and open the solution.

### **3. Configure and Run the Solution**

1.  **Configure Startup Projects:** In Solution Explorer, **right-click** on the solution (`schwartz-data-viz`), select **"Configure Startup Projects,"** choose **"Multiple Startup Projects,"** and select the **"Main"** profile. Click **"Apply"** and then **"OK."**
2.  **Initial Run & Package Installation:** Click **"Start"** (the green play button) to run the solution. This will automatically install all necessary npm packages. You will likely encounter an error on the server side indicating a missing Python package.
3.  **Create Virtual Environment:** Stop running the solution. At the top of Visual Studio, you should see a yellow warning bar. Click **"Create Virtual Environment"** within this warning, and then click **"Create."** Wait for the process to complete in the console.
4.  **Final Run:** Click **"Start"** again. The solution should now run correctly, and you'll see both the frontend and backend applications launch.

### **4. Understand the Solution Structure**

* In the Solution Explorer (usually on the right side of Visual Studio), you will see two main projects:
    * **`Server` (Python Flask Backend):** This project contains the Python code that runs on the server. Flask is a lightweight web framework that handles requests from the frontend, processes data, and provides APIs. It's the "brain" that serves data.
    * **`Client` (React Frontend):** This project contains the JavaScript code that runs in your web browser. React is a library for building user interfaces. It's responsible for what you see and interact with, and it communicates with the Flask backend to get and send data.
* These two parts work together: the `Client` (what the user sees) makes requests to the `Server` (where the data and logic reside) to perform actions and retrieve information.

---

## **Project Structure Explained**

For those new to full-stack development, here's a brief overview:

* **`Server/` (Python Flask Backend):**
    * This directory contains all the code that runs on the server.
    * **Flask** is a web framework that acts as the "brain" of the application. It receives requests from the frontend (e.g., "give me user data," "save this new item"), processes them, potentially interacts with a database, and sends back responses.
    * It exposes **API (Application Programming Interface) endpoints**, which are specific URLs that the frontend can call to perform actions or get data.
    * Think of it as the kitchen in a restaurant: it prepares the food (data) based on orders (requests) from the dining area (frontend).
* **`Client/` (React Frontend):**
    * This directory contains all the code that runs in your web browser.
    * **React** is a JavaScript library used to build the user interface (UI). It's responsible for how the website looks and feels, and how users interact with it.
    * It makes **API calls** to the Flask backend to fetch data to display or send data that the user inputs.
    * Think of it as the dining area and the waiter in a restaurant: it presents the menu (UI), takes your order (user input), sends it to the kitchen (backend), and displays the food (data) when it arrives.

The two parts communicate over HTTP, with the React frontend making requests to the Flask backend's API endpoints.

---

## **License**

See `LICENSE` file for details.