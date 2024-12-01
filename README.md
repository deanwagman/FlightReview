# Welcome to the Beacon AI React Assessment!

This is a basic React project which you will change however you want to achieve the goal below.

## Setup Steps:

1. Clone this repository.
2. Run `yarn` or `npm install` to update packages.
3. Run the project locally with `yarn run dev` or `npm run dev`.
4. The rest is up to you! Make code changes and commits as you see fit.

## The Goal:

Create a page with a clock, a timeline, and multiple displays. You will be displaying the state of an aircraft as it changes over time based on the `time-series-data.json` file.

Take this opportunity to show off your component building style, file/folder organization, and overall skill and familiarity with React! Feel free to use React tools and external libraries. Additionally, be sure to demonstrate how you like to do state management!

Please **_do not_** use component libraries or styling libraries. (MUI, Bootstrap, etc.) Show us your HTML and CSS skills!

1. Build a clock
   - Play
   - Pause
   - Restart
   - View current time
2. Build a timeline
   - Click / slide / scrub along the timeline to update the time (picture the timeline at the bottom of a video player like YouTube)
   - As the clock updates, so does the timeline, and vice-versa
   - The time range should match the range of timestamps from the `time-series-data.json` file
3. Visualize the data currently indicated by the clock.

We expect this project to take around 3 hours, but feel free to spend more or less time as you see fit.

## Submission:
Project Features and Additions

Responsive Layout:

The layout is fully responsive, ensuring the application works seamlessly across all screen sizes, from mobile devices to large desktops.

1. Global State Management with Zustand:

Implemented Zustand to manage the global state of telemetry data, enhancing the efficiency and simplicity of state management.

Precomputed data structures to ensure real-time performance, optimizing the user experience.

2. Data Fetching and Adaptation:

Added functionality to request data from an endpoint and adapt it for application use, with easy expansion to other data sources and endpoints.

3. 3D Avionics Visualization:

Integrated a 3D model of an airplane using React Three Fiber to represent avionic elements like pitch, roll, and scaled altitude.

The 3D visualization provides a more immersive and real-world representation of flight data, enhancing the dashboard's visual appeal.

4. Interactive Chart Section:

Added a chart section to visualize data points from the beginning of the flight to the current timestamp.

Users can toggle specific data values on and off using settings, allowing for custom and granular data reviewing.

Clicking on a timestamp on the X-axis updates the application to view that specific timestamp, making the review process more interactive.

5. Data Breakdown and Customization:

Introduced sections for detailed data breakdowns, offering clear and precise readings of telemetry data.

Data points increment and decrement in real-time to convey a better sense of how values are changing, creating a more dynamic and informative user experience.

6. Semantic UI Components for Accessibility:

All timeline and range components are built using semantic elements, ensuring accessibility and enhancing the user experience for all users.

These additions make the application highly interactive, informative, and visually engaging, with a focus on real-time performance and accessibility. The features provide an intuitive way to explore avionic data, ensuring that users can easily navigate, visualize, and analyze flight information.

