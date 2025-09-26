import axios from "axios";

export class APIInterface {
    static async fetch_stats() {
        return (await axios.get("/stats")).data;
    }

    static async fetch_tables() {
        return (await axios.get("/tables")).data;
    }

    static async fetch_orders() {
        return (await axios.get("/orders")).data;
    } 

    static async fetch_maps() {
        return (await axios.get("/maps")).data;
    }

    static async fetch_news() {
        return (await axios.get("/news")).data;
    }

    static async fetch_articles() {
        return (await axios.get("/maps")).data;
    }

    static async fetch_projects() {
        return (await axios.get("/projects")).data;
    }

    static async fetch_services() {
        return (await axios.get("/services")).data;
    }

    static async fetch_public_map() {
        return (await axios.get("/map")).data;
    }

    static async fetch_public_stats() {
        return (await axios.get("/public-stats")).data;
    }
}
