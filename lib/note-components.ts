// The tags an author may use inside a note. NotesRenderer must provide every
// one of these (enforced at compile time), and the notes push script uses the
// same list to reject unknown tags before anything reaches the database.
export const NOTE_COMPONENT_NAMES = [
  "PillBadge",
  "FunctionPlot",
  "CloudinaryImg",
  "YouTube",
] as const;

export type NoteComponentName = (typeof NOTE_COMPONENT_NAMES)[number];
