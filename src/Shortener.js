import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Card,
  CardContent,
  Alert,
} from "@mui/material";

const MAX_LINKS = 5;

const Shortener = () => {
  const [links, setLinks] = useState([{ url: "", validity: "", shortcode: "" }]);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleChange = (index, field, value) => {
    const newLinks = [...links];
    newLinks[index][field] = value;
    setLinks(newLinks);
  };

  const addLinkField = () => {
    if (links.length < MAX_LINKS) {
      setLinks([...links, { url: "", validity: "", shortcode: "" }]);
    }
  };

  const removeLinkField = (index) => {
    const updated = links.filter((_, i) => i !== index);
    setLinks(updated);
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const generateShortcode = () => {
    return Math.random().toString(36).substr(2, 6);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    const stored = JSON.parse(localStorage.getItem("shortLinks") || "[]");
    const allCodes = stored.map((item) => item.shortcode);
    const created = [];

    for (let i = 0; i < links.length; i++) {
      const { url, validity, shortcode } = links[i];

      if (!url || !isValidUrl(url)) {
        setError(`Invalid URL at row ${i + 1}`);
        return;
      }

      let minutes = parseInt(validity);
      if (validity && (isNaN(minutes) || minutes <= 0)) {
        setError(`Invalid validity at row ${i + 1}`);
        return;
      }

      let code = shortcode || generateShortcode();
      if (!/^[a-zA-Z0-9]{4,12}$/.test(code)) {
        setError(`Shortcode must be 4–12 alphanumeric characters at row ${i + 1}`);
        return;
      }

      if (
        allCodes.includes(code) ||
        created.some((l) => l.shortcode === code)
      ) {
        setError(`Shortcode '${code}' already used at row ${i + 1}. Try a different one.`);
        return;
      }

      const now = Date.now();
      const expires = now + (minutes || 30) * 60 * 1000;

      const item = {
        url,
        shortcode: code,
        created: now,
        expires,
        clicks: [],
      };

      created.push(item);
    }

    const updatedList = [...stored, ...created];
    localStorage.setItem("shortLinks", JSON.stringify(updatedList));
    localStorage.setItem("shortened_urls", JSON.stringify(updatedList));
    setResults(created);
    setLinks([{ url: "", validity: "", shortcode: "" }]);
  };

  return (
    <Box>
      <Typography variant="h3" gutterBottom>
        Create Short Links
      </Typography>

      <form onSubmit={handleSubmit}>
        {links.map((link, index) => (
          <Card key={index} sx={{ mb: 2, p: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">please paste here your Link {index + 1}</Typography>
              <TextField
                label="Enter URL you want to make short"
                fullWidth
                required
                sx={{ mt: 1 }}
                value={link.url}
                onChange={(e) => handleChange(index, "url", e.target.value)}
              />
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <TextField
                  label="Validity in (minutes)"
                  type="number"
                  value={link.validity}
                  onChange={(e) => handleChange(index, "validity", e.target.value)}
                />
                <TextField
                  label="Custom Shortcode"
                  value={link.shortcode}
                  onChange={(e) => handleChange(index, "shortcode", e.target.value)}
                />
              </Box>
              {links.length > 1 && (
                <Button
                  variant="outlined"
                  color="error"
                  sx={{ mt: 2 }}
                  onClick={() => removeLinkField(index)}
                >
                  Delete
                </Button>
              )}
            </CardContent>
          </Card>
        ))}

        {links.length < MAX_LINKS && (
          <Button onClick={addLinkField} variant="outlined" sx={{ mb: 2 }}>
            Add one more
          </Button>
        )}
        <br />
        <Button type="submit" variant="contained">
          Shorten Link
        </Button>
      </form>

      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {results.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Shortened Links</Typography>
          {results.map((item, i) => (
            <Card key={i} sx={{ mt: 2, p: 2 }}>
              <Typography>Original: {item.url}</Typography>
              <Typography>
                Short:{" "}
                <a href={`/${item.shortcode}`}>
                  {window.location.origin}/{item.shortcode}
                </a>
              </Typography>
              <Typography>
                Expires: {new Date(item.expires).toLocaleString()}
              </Typography>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
};

export default Shortener;
