import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Card, Text, useTheme, useThemeMode } from "@rneui/themed";
import axios, { AxiosResponse, AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { FlatList, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { DictionaryAPIUrl } from "../config";
import { WordDetail, WordDetailError } from "../types";

const Detail: React.FC<NativeStackScreenProps<any, "Detail">> = (props) => {
  const theme = useTheme();
  const { mode } = useThemeMode();
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

  const [word, setWord] = useState<WordDetail>(new Object() as WordDetail);

  const fetchDetailsOfAWord = async (word: string) => {
    try {
      const res: AxiosResponse<Array<WordDetail>> = await axios.get(
        DictionaryAPIUrl + word
      );
      setWord(res.data[0]);
    } catch (error: any) {
      const err: AxiosError<WordDetailError> = error;
      if (err) {
      } else {
      }
    } finally {
    }
  };

  useEffect(() => {
    if (props.route.params?.wordDetail) {
      setWord(props.route.params?.wordDetail);
    }
    if (props.route.params?.word) {
      fetchDetailsOfAWord(props.route.params?.word);
    }
  }, [props.route.params]);

  return (
    <SafeAreaView>
      <Text style={styles.text} h4>
        Word : {word.word}
      </Text>

      <Text style={styles.text}>
        {word.origin && `Origin : ${word.origin}`}
      </Text>
      <Text style={styles.text} h4>
        Pronounciation : {word.phonetic}
      </Text>
      <Card.Divider />
      <FlatList
        data={word.meanings}
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
    </SafeAreaView>
  );
};

export default Detail;
