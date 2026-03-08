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
    final colorScheme = ColorScheme.fromSeed(
      seedColor: const Color(0xFF1F7A4D),
      brightness: Brightness.light,
    );

    return MaterialApp(
      title: 'GoGreenTech Learning Academy',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: colorScheme,
        scaffoldBackgroundColor: const Color(0xFFF4FBF6),
        textTheme: GoogleFonts.plusJakartaSansTextTheme(),
        useMaterial3: true,
        appBarTheme: AppBarTheme(
          backgroundColor: Colors.white.withValues(alpha: 0.92),
          foregroundColor: const Color(0xFF163D2F),
          elevation: 0,
          titleTextStyle: GoogleFonts.fraunces(
            color: const Color(0xFF163D2F),
            fontSize: 22,
            fontWeight: FontWeight.w700,
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
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [Color(0xFFF9FFF9), Color(0xFFE7F5EA)],
            begin: Alignment.topLeft,
            end: Alignment.bottomRight,
          ),
        ),
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(
                  color: Colors.white.withValues(alpha: 0.9),
                  borderRadius: BorderRadius.circular(32),
                  boxShadow: const [
                    BoxShadow(
                      blurRadius: 24,
                      offset: Offset(0, 12),
                      color: Color(0x1F1F7A4D),
                    ),
                  ],
                ),
                child: const BrandLogo(size: 108, radius: 24),
              ),
              const SizedBox(height: 24),
              Text(
                'GoGreenTech',
                style: GoogleFonts.fraunces(
                  fontSize: 34,
                  fontWeight: FontWeight.w700,
                  color: const Color(0xFF163D2F),
                ),
              ),
              const SizedBox(height: 8),
              const Text('Loading academy platform...'),
            ],
          ),
        ),
      ),
    );
  }
}
