/* istanbul ignore next */
import app from "./index";
import dotenv from 'dotenv/config';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
}) 