import ntoImage from "@/assets/never-too-old.jpeg";
import ladyGagaImage from "@/assets/Lady_Gaga_and_Bruno_Mars_-_Die_with_a_Smile.png";

export const SONGS = [
  {
    title: "Never too Old",
    desc: "Song by Monrroe ‧ 2019",
    image: ntoImage,
    lyrics: "/lyrics.lrc",
    audio: "/song.mp3",
  },
  {
    title: "Die with a Smile",
    desc: "Song by Lady Gaga, Bruno Mars ‧ 2024",
    image: ladyGagaImage,
    lyrics: "/Lady Gaga & Bruno Mars - Die With A Smile.lrc",
    audio: "/Lady Gaga, Bruno Mars – Die With A Smile.mp3",
  },
  {
    title: "Go Fuck Yourself",
    desc: "Two Feet",
    image: ladyGagaImage,
    lyrics: "/Two Feet - Go Fuck Yourself.lrc",
    audio: "/two-feet-go-fuck-yourself-(meloua.com).mp3",
  },
];

export const activeSong = SONGS[0];
