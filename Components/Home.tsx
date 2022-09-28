import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Button, Dialog, Divider, Icon, Overlay, Text } from "@rneui/base";
import {
  Card,
  ListItem,
  SearchBar,
  useTheme,
  useThemeMode,
} from "@rneui/themed";
import axios, { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import {
  FlatList,
  Modal,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { DictionaryAPIUrl, RandomWordAPI } from "../config";
import { RandomWord, WordDetail, WordDetailError } from "../types";

const Home: React.FC<NativeStackScreenProps<any, "Home">> = (props) => {
  const [randomWord, setRandomWord] = useState<RandomWord>(
    new Object() as RandomWord
  );
  const [loading, setLoading] = useState(false);
  const fetchARandomWord = async () => {
    const res: AxiosResponse<Array<RandomWord>> = await axios.get(
      RandomWordAPI
    );
    setRandomWord(res.data[0]);
    fetchDetailsOfAWord(res.data[0].word);
  };
  useEffect(() => {
    fetchARandomWord();
  }, [props.route.key]);
  const theme = useTheme();
  const { mode } = useThemeMode();
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const toggleModal = async () => {
    search.length && (await fetchDetailsOfAWord(search));
    setOpenModal(!openModal);
  };
  const [wordDetails, setWordDetails] = useState<Array<WordDetail>>(
    new Array<WordDetail>()
  );
  const fetchDetailsOfAWord = async (word: string) => {
    try {
      setLoading(true);
      const res: AxiosResponse<Array<WordDetail>> = await axios.get(
        DictionaryAPIUrl + word
      );
      setWordDetails(res.data);
    } catch (error: any) {
      const err: AxiosError<WordDetailError> = error;
      if (err) {
      } else {
      }
    } finally {
      setLoading(false);
    }
  };

  const styles = StyleSheet.create({
    text: {
      fontSize: 16,
      color:
        mode === "dark" ? theme.theme.colors.black : theme.theme.colors.white,
    },
    bgCard: {
      backgroundColor:
        mode === "dark" ? theme.theme.colors.black : theme.theme.colors.white,
      borderColor: "dark" ? theme.theme.colors.black : theme.theme.colors.white,
    },
  });

  return (
    <>
      <SafeAreaView
        style={{
          display: "flex",
          alignItems: "center",
          marginTop: 5,
        }}
      >
        <SearchBar
          onChangeText={(text) => setSearch(text)}
          value={search}
          placeholder="Search Here"
          round
          leftIcon={false}
          clearIcon={false}
          rightIcon={false}
          searchIcon={false}
          cancelIcon={false}
          inputStyle={{ color: "white" }}
          containerStyle={{ width: "100%" }}
          onEndEditing={toggleModal}
          showLoading={loading}
        />
        <Text
          style={{
            color:
              mode === "dark"
                ? theme.theme.colors.black
                : theme.theme.colors.white,
            fontSize: 24,
            fontWeight: "bold",
            fontStyle: "normal",
          }}
        >
          Word Of The Day
        </Text>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate("Detail", { word: randomWord.word });
          }}
        >
          <Card wrapperStyle={{ minWidth: 150, maxWidth: 300 }}>
            <Card.Title>{randomWord.word}</Card.Title>
            <Card.Divider />
            <Text
              style={{
                color: theme.theme.colors.black,
                fontStyle: "normal",
                marginBottom: 10,
              }}
            >
              Pronunciation : {randomWord.pronunciation}
            </Text>
            <Card.Divider />
            <Text
              style={{
                color: theme.theme.colors.black,
                fontStyle: "normal",
              }}
            >
              Definition : {randomWord.definition}
            </Text>
          </Card>
        </TouchableOpacity>
      </SafeAreaView>
      <SafeAreaView style={{ zIndex: 1 }}>
        <Overlay
          ModalComponent={Modal}
          collapsable
          overlayStyle={{
            backgroundColor: "grey",
            minWidth: "90%",
            maxHeight: "75%",
          }}
          onRequestClose={toggleModal}
          isVisible={openModal}
          animationType="slide"
        >
          <Button
            size="sm"
            TouchableComponent={TouchableOpacity}
            onPress={toggleModal}
            color="secondary"
            style={{
              width: 24,
              height: 20,
              marginBottom: 15,
              alignSelf: "flex-end",
            }}
          >
            <Icon name="close" size={12} />
          </Button>
          <SafeAreaView>
            {search.length ? (
              <FlatList
                data={wordDetails}
                renderItem={(word) => {
                  return (
                    <ScrollView>
                      <TouchableOpacity
                        onPress={() =>
                          props.navigation.navigate("Detail", {
                            wordDetail: word.item,
                          })
                        }
                      >
                        <Card theme={theme.theme}>
                          <ScrollView>
                            <Text style={styles.text} h4>
                              Word : {word.item.word}
                            </Text>

                            <Text style={styles.text}>
                              {word.item.origin &&
                                `Origin : ${word.item.origin}`}
                            </Text>
                            <Text style={styles.text} h4>
                              Pronounciation : {word.item.phonetic}
                            </Text>
                            <Card.Divider />
                            <FlatList
                              data={word.item.meanings}
                              renderItem={(meaning) => {
                                return (
                                  <ScrollView>
                                    <Text style={styles.text} h4>
                                      {meaning.item.partOfSpeech}
                                    </Text>

                                    <FlatList
                                      data={meaning.item.definitions}
                                      renderItem={(def) => {
                                        return (
                                          <Text
                                            style={{
                                              ...styles.text,
                                              marginBottom: 2,
                                            }}
                                          >
                                            {def.item.definition}
                                          </Text>
                                        );
                                      }}
                                    />
                                    <Card.Divider />
                                  </ScrollView>
                                );
                              }}
                            />
                          </ScrollView>
                        </Card>
                      </TouchableOpacity>
                    </ScrollView>
                  );
                }}
              ></FlatList>
            ) : (
              <Text>Please Enter a Word</Text>
            )}
          </SafeAreaView>
        </Overlay>
      </SafeAreaView>
    </>
  );
};

export default Home;
