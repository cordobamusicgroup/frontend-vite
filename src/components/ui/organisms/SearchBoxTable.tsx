import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import Search from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

interface SearchBoxTableProps {
  searchTextRef: React.RefObject<HTMLInputElement | null>;
  applyFilter: () => void;
  resetFilter: () => void;
}

const SearchBoxTable: React.FC<SearchBoxTableProps> = ({ searchTextRef, applyFilter, resetFilter }) => {
  return (
    <Box mt={2} mb={2}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search"
        inputRef={searchTextRef}
        onKeyDown={(e) => e.key === "Enter" && applyFilter()}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={applyFilter} aria-label="search">
                <Search />
              </IconButton>
              <IconButton onClick={resetFilter} aria-label="clear">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Box>
  );
};

export default SearchBoxTable;
