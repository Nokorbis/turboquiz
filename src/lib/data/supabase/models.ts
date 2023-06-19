import type { Database } from "./types";

export type Profile = Database['public']['Tables']['profile']['Row'];
export type ProfileU = Database['public']['Tables']['profile']['Update'];
export type UserPermissions = Database['public']['Tables']['user_permission']['Row'];
export type UserPermissionsU = Database['public']['Tables']['user_permission']['Update'];


export type Game = Database['public']['Tables']['game']['Row'];
export type GameU = Database['public']['Tables']['game']['Update'];
export type GamePlayer = Database['public']['Tables']['game_player']['Row'];
export type GamePlayerU = Database['public']['Tables']['game_player']['Update'];

export type GamePlayerWithProfile = GamePlayer & { profile: Profile };


export type GridGame = Database['public']['Tables']['grid_game']['Row'];
export type GridGameU = Database['public']['Tables']['grid_game']['Update'];
export type GridTheme = Database['public']['Tables']['grid_theme']['Row'];
export type GridThemeU = Database['public']['Tables']['grid_theme']['Update'];
export type GridQuestion = Database['public']['Tables']['grid_question']['Row'];
export type GridQuestionU = Database['public']['Tables']['grid_question']['Update'];

export type GridThemeWithQuestions = GridTheme & { questions: GridQuestion[]};
export type GridThemeWithQuestionsU = GridThemeU & { questions: GridQuestionU[]};


export type TimedTheme = Database['public']['Tables']['timed_theme']['Row'];
export type TimedThemeU = Database['public']['Tables']['timed_theme']['Update'];
export type TimedQuestion = Database['public']['Tables']['timed_question']['Row'];
export type TimedQuestionU = Database['public']['Tables']['timed_question']['Update'];

export type TimedThemeWithQuestions = TimedTheme & { questions: TimedQuestion[]};
export type TimedThemeWithQuestionsU = TimedThemeU & { questions: TimedQuestionU[]};

export type PlayerWithTheme = Database['public']['Views']['v_themes_by_players']['Row'];

