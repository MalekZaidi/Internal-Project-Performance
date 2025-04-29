import React, { useState } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

const SearchBar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <Box
    sx={{
      display: "flex",
      alignItems: "center",
      backgroundColor: "#333",
      borderRadius: 1,
      width: 280,
      mx: 2,
      border: "1px solid rgb(255, 255, 255)" // 👈 Thin subtle border
    }}
  >
  
      <TextField
        variant="standard"
        placeholder="Search..."
        value={searchTerm}
        onChange={handleSearchChange}
        sx={{ width: "100%", "& input": { padding: "4px 0", color: "white" } }}
        InputProps={{
          disableUnderline: true,
          endAdornment: (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              {searchTerm && (
                <IconButton onClick={clearSearch} sx={{ padding: 0 }}>
                  <ClearIcon sx={{ color: "white" }} />
                </IconButton>
              )}
              <SearchIcon sx={{ color: "white" }} />
            </Box>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBar;