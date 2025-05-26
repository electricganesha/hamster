# 🐹 Mooey Maria Hazel 🐹 Monitoring Dashboard

This project is a full-stack monitoring dashboard for Mooey Maria Hazel, a very active hamster! It tracks her nightly running activity using a Raspberry Pi and Keyestudio sensors, storing and visualizing the data with a modern Next.js web app.

---

## 🚀 Features

- **Session Tracking:** Records every running session with start/end time, wheel rotations, and per-rotation logs (timestamp, temperature, humidity).
- **Per-Rotation Logging:** Stores detailed logs for each wheel rotation, including timestamp, temperature, and humidity.
- **Distance Calculation:** Computes distance run based on a configurable wheel diameter (default: 28cm).
- **Speed Calculation:** Calculates average speed (meters per second) for each session and aggregates by day.
- **Sensor Integration:** Uses a Raspberry Pi with:
  - Keyestudio KS0020 Hall Effect sensor (for wheel rotations)
  - Keyestudio DHT22 sensor (for temperature & humidity)
- **Data Storage:** All data is sent to a PostgreSQL database (via Supabase).
- **Dashboard:**
  - Filter by date, distance, speed, temperature, humidity
  - Aggregates and visualizes sessions by day
  - Interactive charts for distance, speed, rotations, temperature, and humidity trends
  - Responsive table and card views for session data
- **Image Support:** Optionally attach images to sessions.

---

## 📦 Tech Stack

- **Frontend:** Next.js (App Router), React, TypeScript, Material UI (MUI), MUI X Charts
- **Backend:** Next.js API routes, Prisma ORM
- **Database:** PostgreSQL (hosted on Supabase)
- **Hardware:** Raspberry Pi, Keyestudio KS0020 Hall Effect sensor, Keyestudio DHT22 sensor

---

## 🛠️ Getting Started

1. **Install dependencies:**

```bash
npm install
```

2. **Set up environment variables:**

Create a `.env` file with your Supabase/PostgreSQL connection string:

```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>
```

3. **Run database migrations:**

```bash
npx prisma migrate dev --name init
```

4. **Start the development server:**

```bash
npm run dev
```

5. **Open the dashboard:**

Go to [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📝 Project Motivation

Mooey Maria Hazel was running so much every night that we got curious about how much distance she would actually cover! This project was created to answer that question and to have fun visualizing her activity.

---

## 📊 How It Works

- The Raspberry Pi collects data from the wheel (rotations) and the environment (temperature, humidity) using the sensors.
- Each rotation is logged with a timestamp, temperature, and humidity, and sent to the backend as a session.
- Data is stored in a PostgreSQL database.
- The Next.js dashboard fetches and visualizes this data, allowing filtering and exploration.
- Distance is calculated as:

  ```
  distance = rotations × π × wheel_diameter
  ```

  (Default wheel diameter: 28cm)

- Speed is calculated as:

  ```
  speed = distance / duration (in seconds)
  ```

---

## 📁 Project Structure

- `src/app/` - Next.js app directory (pages, API routes, global styles)
- `src/components/` - React UI components (Dashboard, Filters, AboutModal, etc.)
- `src/utils/` - Utility functions (distance, speed, session calculations, etc.)
- `prisma/` - Prisma schema and migrations
- `public/images/` - Static assets (e.g., Mooey's photo)

---

## 📜 License

MIT License. See [LICENSE](LICENSE) for details.

---

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org)
- [Material UI](https://mui.com)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)
- [Keyestudio Sensors](https://www.keyestudio.com/)

---

Enjoy tracking Mooey's adventures! 🐹
