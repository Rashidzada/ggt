import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';

import 'api_service.dart';
import 'app_controller.dart';
import 'screens/auth_screen.dart';
import 'screens/home_shell.dart';
import 'widgets/common_widgets.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    ChangeNotifierProvider(
      create: (_) => AppController(ApiService())..initialize(),
      child: const GoGreenTechApp(),
    ),
  );
}

class GoGreenTechApp extends StatelessWidget {
  const GoGreenTechApp({super.key});

  @override
  Widget build(BuildContext context) {
    const seed = Color(0xFF1F7A4D);
    final colorScheme = ColorScheme.fromSeed(seedColor: seed, brightness: Brightness.light);

    return MaterialApp(
      title: 'GoGreenTech Learning Academy',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: colorScheme,
        scaffoldBackgroundColor: const Color(0xFFF4FBF6),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(),
        useMaterial3: true,
        cardTheme: CardThemeData(
          color: Colors.white.withValues(alpha: 0.92),
          elevation: 0,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
        ),
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.white.withValues(alpha: 0.75),
          foregroundColor: const Color(0xFF163D2F),
          elevation: 0,
          scrolledUnderElevation: 0,
          titleTextStyle: GoogleFonts.fraunces(
            color: const Color(0xFF163D2F),
            fontSize: 22,
            fontWeight: FontWeight.w700,
          ),
        ),
        inputDecorationTheme: InputDecorationTheme(
          filled: true,
          fillColor: Colors.white.withValues(alpha: 0.82),
          border: OutlineInputBorder(
            borderRadius: BorderRadius.circular(22),
            borderSide: BorderSide.none,
          ),
          enabledBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(22),
            borderSide: BorderSide.none,
          ),
          focusedBorder: OutlineInputBorder(
            borderRadius: BorderRadius.circular(22),
            borderSide: const BorderSide(color: Color(0xFF1F7A4D), width: 1.4),
          ),
          contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),
        ),
        filledButtonTheme: FilledButtonThemeData(
          style: FilledButton.styleFrom(
            backgroundColor: const Color(0xFF1F7A4D),
            foregroundColor: Colors.white,
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
            textStyle: const TextStyle(fontWeight: FontWeight.w700),
          ),
        ),
        outlinedButtonTheme: OutlinedButtonThemeData(
          style: OutlinedButton.styleFrom(
            foregroundColor: const Color(0xFF163D2F),
            padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
            side: const BorderSide(color: Color(0xFFBFD8C7)),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(22)),
            textStyle: const TextStyle(fontWeight: FontWeight.w700),
          ),
        ),
      ),
      home: Consumer<AppController>(
        builder: (context, controller, _) {
          if (controller.isInitializing) {
            return const SplashScreen();
          }

          if (controller.user == null) {
            return const AuthScreen();
          }

          return const AcademyShell();
        },
      ),
    );
  }
}

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: AppGradientBackground(
        child: Center(
          child: TweenAnimationBuilder<double>(
            tween: Tween(begin: 0.86, end: 1),
            duration: const Duration(milliseconds: 900),
            curve: Curves.easeOutCubic,
            builder: (context, value, child) {
              return Opacity(
                opacity: value,
                child: Transform.scale(scale: value, child: child),
              );
            },
            child: Container(
              margin: const EdgeInsets.symmetric(horizontal: 32),
              padding: const EdgeInsets.all(30),
              decoration: BoxDecoration(
                color: Colors.white.withValues(alpha: 0.82),
                borderRadius: BorderRadius.circular(38),
                boxShadow: const [
                  BoxShadow(
                    blurRadius: 42,
                    offset: Offset(0, 24),
                    color: Color(0x1F163D2F),
                  ),
                ],
              ),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        width: 150,
                        height: 150,
                        decoration: const BoxDecoration(
                          shape: BoxShape.circle,
                          gradient: LinearGradient(
                            colors: [Color(0xFFDFF3E4), Color(0xFFFDF3E8)],
                            begin: Alignment.topLeft,
                            end: Alignment.bottomRight,
                          ),
                        ),
                      ),
                      const BrandLogo(size: 96, radius: 28),
                    ],
                  ),
                  const SizedBox(height: 26),
                  Text(
                    'GoGreenTech',
                    style: GoogleFonts.fraunces(
                      fontSize: 36,
                      fontWeight: FontWeight.w700,
                      color: const Color(0xFF163D2F),
                    ),
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Learning Academy',
                    style: TextStyle(
                      letterSpacing: 2.6,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF4D6B5D),
                    ),
                  ),
                  const SizedBox(height: 16),
                  const Text(
                    'Preparing your courses, free lessons, notifications, and dashboard.',
                    textAlign: TextAlign.center,
                    style: TextStyle(height: 1.5),
                  ),
                  const SizedBox(height: 22),
                  const SizedBox(
                    width: 34,
                    height: 34,
                    child: CircularProgressIndicator(strokeWidth: 3),
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
