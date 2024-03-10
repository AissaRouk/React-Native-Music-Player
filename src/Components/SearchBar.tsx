import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
  Text,
} from "react-native";
import { useMiniSearch } from "react-minisearch";
// import sortResultsByPrice from "./sortFunction";

// Defining types of props
interface SearchBarProps {
  border?: boolean;
  placeholder?: string;
  data: readonly any[];
  onSearchResultsChange?: (searchResult: readonly any[] | null) => void;
  autofocus?: boolean;
  suggestionShown: boolean;

  // Additional customization props
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: number;
  borderRadius?: number;
  placeholderTextColor?: string;
  inputStyle?: StyleProp<TextStyle>;
  suggestionBoxStyle?: StyleProp<ViewStyle>;
  fontSize?: number;
  clearIcon?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
  mainContainerViewStyle?: StyleProp<ViewStyle>;
  fields?: string[];
  idField?: string;
}

export default function SearchBar({
  border = false,
  placeholder = "Search",
  data,
  autofocus = false,
  onSearchResultsChange,
  backgroundColor = "white",
  textColor = "black",
  borderColor = "black",
  borderWidth = 1,
  borderRadius = 7,
  placeholderTextColor = "grey",
  inputStyle,
  suggestionBoxStyle,
  fontSize = 16,
  clearIcon,
  onFocus,
  onBlur,
  mainContainerViewStyle,
  suggestionShown = true,
  fields,
  idField,
}: SearchBarProps) {
  // State for managing suggestions visibility
  const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

  // MiniSearch hook for handling search functionality
  const {
    autoSuggest,
    suggestions,
    clearSuggestions,
    search,
    clearSearch,
    searchResults,
    removeAll,
    addAll,
  } = useMiniSearch(data, {
    fields: fields || [],
    idField: idField,
    searchOptions: {
      prefix: true,
      fuzzy: true,
    },
    autoSuggestOptions: {
      prefix: true,
      fuzzy: true,
    },
  });

  // State for the text introduced in the searchBar
  const [searchValue, setSearchValue] = useState("");

  // Show suggestions every time the text changes
  const onChangeText = (text: string) => {
    setSearchValue(text);
    if (!text) {
      !suggestionShown && console.log("Not text");
      setShowSuggestions(false);
      clearSuggestions();
      !suggestionShown && clearSearch();
      return;
    }
    if (suggestionShown) {
      autoSuggest(text);
      setShowSuggestions(true);
    } else {
      search(text);
    }
  };

  // Search when clicked enter (onBlur) in the searchBar
  const handleOnBlur = () => {
    if (searchValue) {
      clearSuggestions();
      search(searchValue);
      suggestionShown && setShowSuggestions(false);
      onBlur && onBlur();
    }
  };

  // Function to handle pressing on one of the suggestions
  const handleOnSuggestionPress = (item: any) => {
    // Save the value
    setSearchValue(item.suggestion);
    // Clear the suggestions
    suggestionShown && setShowSuggestions(false);
    suggestionShown && clearSuggestions();
    // Search for the result
    search(item.suggestion);
  };

  // Do something when the results change
  useEffect(() => {
    // Update MiniSearch data when data prop changes
    if (data) {
      removeAll();
      addAll(data);
    }
  }, [data]);

  //   // Do something when the results change
  useEffect(() => {
    // Sort the results by price order
    if (searchResults || !suggestionShown) {
      onSearchResultsChange && onSearchResultsChange(searchResults);
    }
  }, [searchResults]);

  return (
    <View style={mainContainerViewStyle}>
      {/* Search bar container */}
      <View
        style={[
          styles.searchbarView,
          styles.searchBarBackground,
          styles.searchBarPaddings,
          border && styles.searchBarBorder,
          suggestionShown &&
            showSuggestions && {
              borderBottomEndRadius: 0,
              borderBottomLeftRadius: 0,
              borderBottomWidth: 0,
            },
          {
            backgroundColor: backgroundColor,
            borderColor: borderColor,
            borderWidth: borderWidth,
            borderRadius: borderRadius,
          },
        ]}
      >
        {/* Search bar text input */}
        <TextInput
          style={[
            styles.searchBarText,
            inputStyle,
            { color: textColor, fontSize: fontSize },
          ]}
          placeholder={placeholder}
          placeholderTextColor={placeholderTextColor}
          value={searchValue}
          onChangeText={onChangeText}
          blurOnSubmit={true}
          onBlur={() => {
            handleOnBlur();
          }}
          onFocus={() => {
            suggestionShown && setShowSuggestions(true);
            onFocus && onFocus();
          }}
          autoFocus={autofocus}
        />
        {/* Clear icon */}
        {clearIcon && (
          <TouchableOpacity onPress={() => setSearchValue("")}>
            {clearIcon}
          </TouchableOpacity>
        )}
      </View>

      {/* Conditional rendering of line based on showSuggestions */}
      {suggestionShown && showSuggestions && (
        <View style={[styles.line, { marginHorizontal: 25 }]}></View>
      )}

      {/* Suggestions container */}
      {suggestionShown && showSuggestions && (
        <View
          style={[
            styles.searchBarBackground,
            styles.searchBarBorder,
            suggestionBoxStyle,
            suggestionShown &&
              showSuggestions && {
                borderTopWidth: 0,
                borderTopStartRadius: 0,
                borderTopEndRadius: 0,
                paddingBottom: 5,
                // flex: 1,
              },
          ]}
        >
          {/* Render suggestions */}
          {suggestions &&
            suggestions.map((item) => (
              <TouchableOpacity
                style={[styles.suggestionItem]}
                // onPress={() => handleOnSuggestionPress(item)}
                key={item.suggestion}
              >
                <Text style={[styles.searchBarText, { fontSize: fontSize }]}>
                  {item.suggestion}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      )}
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  searchbarView: {
    minWidth: 200,
    height: 35,
    borderColor: "black",
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchBarPaddings: {
    paddingHorizontal: 7,
  },
  searchBarBackground: {
    backgroundColor: "white",
  },
  searchBarBorder: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "black",
  },
  searchBarText: {
    flex: 1,
    color: "black",
  },
  line: { borderBottomWidth: 0.2, borderColor: "grey" },
  suggestionItem: {
    height: 20,
  },
});
