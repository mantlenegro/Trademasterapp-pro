import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { 
  StyleSheet, Text, View, ScrollView, TouchableOpacity, Image, Platform, ActivityIndicator 
} from "react-native";
import { WebView } from "react-native-webview";
import { StatusBar } from "expo-status-bar";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { BannerAd, BannerAdSize, TestIds, RewardedAd, RewardedAdEventType } from 'react-native-google-mobile-ads';

// --- 🎨 THEME CONFIG ---
const THEME = {
  bg: "#0F172A",      
  card: "#1E293B",    
  primary: "#6366F1", 
  success: "#10B981", 
  text: "#F8FAFC",
  sub: "#94A3B8",
  border: "rgba(255,255,255,0.08)"
};

// --- 📚 FULL CURRICULUM DATA ---
const TRADING_ACADEMY = [
  {
    id: "stage1",
    title: "Stage 1: Foundations",
    difficulty: "Beginner",
    lessons: [
      {
        id: "s1l1",
        title: "The Big Concept: What is Forex?",
        content: "Forex is the largest market in the world. You trade currency pairs like EUR/USD. When one goes up, the other goes down.",
        steps: ["Base vs Quote Currencies", "Major Pairs", "Market Hours"],
        video: "https://youtube.com",
        premium: false
      }
    ]
  },
  {
    id: "stage2",
    title: "Stage 2: Technical Mechanics",
    difficulty: "Intermediate",
    lessons: [
      {
        id: "s2l1",
        title: "Reading Candlesticks",
        content: "Candles tell the story of price. Learn to spot 'Wicks' which represent rejection from big banks.",
        steps: ["OHLC Basics", "Doji & Hammers", "Engulfing Patterns"],
        video: "https://youtube.com",
        premium: false
      }
    ]
  },
  {
    id: "stage3",
    title: "Stage 3: Risk & Psychology",
    difficulty: "Advanced",
    lessons: [
      {
        id: "s3l1",
        title: "The 1% Risk Rule",
        content: "Never risk more than 1% of your account per trade. This ensures you can survive a losing streak.",
        steps: ["Position Sizing", "Stop Loss Placement", "Risk-to-Reward Ratio"],
        video: "https://youtube.com",
        premium: false
      }
    ]
  },
  {
    id: "stage4",
    title: "Stage 4: Institutional Mastery",
    difficulty: "Pro",
    lessons: [
      {
        id: "s4l1",
        title: "Smart Money (SMC)",
        content: "Learn to trade with the banks using Break of Structure (BOS) and Order Blocks. Stop being retail liquidity.",
        steps: ["BOS vs CHoCH", "Order Block Identification", "Fair Value Gaps (FVG)"],
        video: "https://youtube.com",
        premium: true // This triggers the Rewarded Ad
      }
    ]
  }
];

const Stack = createNativeStackNavigator();
const rewarded = RewardedAd.createForAdRequest(TestIds.REWARDED);

// --- 🏠 HOME SCREEN ---
function HomeScreen({ navigation }) {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.brand}>Trading Academy</Text>
        <Text style={styles.sub}>Master the Markets: Zero to Pro</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text>🔥 Streak: 3</Text></View>
        <View style={styles.statBox}><Text>🏆 XP: 450</Text></View>
      </View>

      {TRADING_ACADEMY.map(stage => (
        <TouchableOpacity 
            key={stage.id} 
            style={styles.card} 
            onPress={() => navigation.navigate("Course", { course: stage })}
        >
          <View style={styles.cardContent}>
            <Text style={styles.courseTitle}>{stage.title}</Text>
            <Text style={styles.courseSub}>{stage.difficulty} • {stage.lessons.length} Lessons</Text>
          </View>
        </TouchableOpacity>
      ))}

      <BannerAd unitId={TestIds.BANNER} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </ScrollView>
  );
}

// --- 📚 COURSE SCREEN ---
function CourseScreen({ route, navigation }) {
  const { course } = route.params;
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>{course.title} Lessons</Text>
      {course.lessons.map(lesson => (
        <TouchableOpacity 
            key={lesson.id} 
            style={styles.lessonCard} 
            onPress={() => navigation.navigate("Lesson", { lesson, courseTitle: course.title })}
        >
          <Text style={styles.text}>{lesson.premium ? "🔒" : "📖"} {lesson.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

// --- 📖 LESSON SCREEN (Monetized) ---
function LessonScreen({ route }) {
  const { lesson, courseTitle } = route.params;
  const [unlocked, setUnlocked] = useState(!lesson.premium);
  const [showVideo, setShowVideo] = useState(false);

  const handleUnlock = () => {
    const unsubscribeEarned = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        setUnlocked(true);
    });
    rewarded.load();
    rewarded.show();
  };

  const generateCert = async () => {
    const html = `<h1 style='text-align:center'>Certificate of Completion</h1><p style='text-align:center'>Verified completion of ${courseTitle}</p>`;
    const { uri } = await Print.printToFileAsync({ html });
    await Sharing.shareAsync(uri);
  };

  if (!unlocked) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.title}>Premium Lesson 🔒</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={handleUnlock}>
          <Text style={styles.btnText}>Watch Ad to Unlock</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={{ padding: 20 }}>
        <Text style={styles.lessonTitle}>{lesson.title}</Text>
        <View style={styles.teachingBox}><Text style={styles.lessonDesc}>{lesson.content}</Text></View>
        
        {lesson.steps.map((s, i) => <Text key={i} style={styles.stepText}>✅ {s}</Text>)}

        <TouchableOpacity style={styles.videoToggle} onPress={() => setShowVideo(!showVideo)}>
          <Text style={styles.videoToggleText}>{showVideo ? "Hide Video" : "📺 Watch Video Tutorial"}</Text>
        </TouchableOpacity>

        {showVideo && (
          <View style={styles.videoWrapper}>
            <WebView source={{ uri: lesson.video }} style={{ flex: 1, backgroundColor: '#000' }} />
          </View>
        )}

        <TouchableOpacity style={styles.primaryButton} onPress={generateCert}>
          <Text style={styles.btnText}>Complete & Get Certificate 🎓</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

// --- 🚀 MAIN APP ---
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ 
            headerStyle: { backgroundColor: THEME.bg }, 
            headerTintColor: THEME.text,
            contentStyle: { backgroundColor: THEME.bg }
        }}>
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Course" component={CourseScreen} />
          <Stack.Screen name="Lesson" component={LessonScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.bg },
  header: { padding: 30, paddingTop: 60 },
  brand: { color: THEME.text, fontSize: 32, fontWeight: "900" },
  sub: { color: THEME.sub, fontSize: 16 },
  statsRow: { flexDirection: "row", justifyContent: "space-around", marginBottom: 20 },
  statBox: { backgroundColor: THEME.card, padding: 15, borderRadius: 12, width: '40%', alignItems: 'center' },
  card: { backgroundColor: THEME.card, marginHorizontal: 20, marginBottom: 15, borderRadius: 16, borderLeftWidth: 5, borderLeftColor: THEME.primary },
  cardContent: { padding: 20 },
  courseTitle: { color: THEME.text, fontSize: 18, fontWeight: "700" },
  courseSub: { color: THEME.sub, marginTop: 5 },
  sectionTitle: { color: THEME.text, fontSize: 22, fontWeight: "bold", padding: 20 },
  lessonCard: { backgroundColor: THEME.card, padding: 20, marginHorizontal: 20, marginBottom: 10, borderRadius: 12 },
  text: { color: THEME.text },
  lessonTitle: { color: THEME.text, fontSize: 26, fontWeight: "800", marginBottom: 15 },
  teachingBox: { backgroundColor: THEME.card, padding: 20, borderRadius: 15, marginBottom: 20 },
  lessonDesc: { color: THEME.text, lineHeight: 24, fontSize: 16 },
  stepText: { color: THEME.sub, fontSize: 16, marginBottom: 10 },
  videoToggle: { marginVertical: 20, padding: 15, borderRadius: 12, backgroundColor: 'rgba(99,102,241,0.1)', alignItems: 'center' },
  videoToggleText: { color: THEME.primary, fontWeight: '700' },
  videoWrapper: { height: 220, borderRadius: 15, overflow: 'hidden', marginBottom: 20 },
  primaryButton: { backgroundColor: THEME.primary, padding: 20, borderRadius: 15, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  centered: { justifyContent: 'center', alignItems: 'center' }
});
