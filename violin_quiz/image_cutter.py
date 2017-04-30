from PIL import Image

notes = ['A2', 'A#2', 'A3', 'A#3', 'A4', 'A#4', 'A5', 'A#5', 'B2', 'B3', 'B4', 'B5', 'C3', 'C#3', 'C4', 'C#4', 'C5', 'C#5',
  'D3', 'D#3', 'D4', 'D#4', 'D5', 'D#5', 'E3', 'E4', 'E5', 'F3', 'F#3', 
  'F4', 'F#4', 'F5', 'F#5', 'G2', 'G#2', 'G3', 'G#3', 'G4', 'G#4', 'G5', 'G#5']
  
for note in notes:
	if '#' not in note:
		img = Image.open('notes_sheet/' + note.lower() + '.png')
		area = (1630, 620, 1900, 800)
		cropped_img = img.crop(area)
		cropped_img.show()
		cropped_img.save('violin_notes1/' + note.lower() + '.png')
		
