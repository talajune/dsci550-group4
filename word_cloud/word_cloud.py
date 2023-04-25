import pandas as pd 

df = pd.read_csv('full.tsv', delimiter='\t')
pd.set_option('max_colwidth', None)


male_mask = df['Gender'].str.strip() == 'male'
male_objects = df.loc[male_mask, 'Object_Recognized']
total_num_rows = male_objects.shape[0]
selected_num_rows = int(total_num_rows * 0.5)
male_subset = male_objects.sample(n=selected_num_rows)

# print(male_objects.head)
subset = male_subset.str.replace(',', '').str.replace('[','').str.replace(']','').str.replace("'",'')
male_text = male_subset.to_string(index=False, header=False).strip()
with open("male_text.txt", "w") as f: 
    f.write(male_text)
f.close()


female_mask = df['Gender'].str.strip() == 'female'
female_objects = df.loc[female_mask, 'Object_Recognized']
total_num_rows = female_objects.shape[0]
selected_num_rows = int(total_num_rows * 0.5)
female_subset = female_objects.sample(n=selected_num_rows)
# print(female_objects.head)
female_subset = female_subset.str.replace(',', '').str.replace('[','').str.replace(']','').str.replace("'",'')
female_text = female_subset.to_string(index=False, header=False).strip()
with open("female_text.txt", "w") as f: 
    f.write(female_text)
f.close()


others_mask = df['Gender'] == 'others'
others_objects = df.loc[others_mask, 'Object_Recognized']
total_num_rows = others_objects.shape[0]
selected_num_rows = int(total_num_rows * 0.5)
others_subset = others_objects.sample(n=selected_num_rows)
others_subset = others_subset.str.replace(',', '').str.replace('[','').str.replace(']','').str.replace("'",'')
others_text = others_subset.to_string(index=False, header=False).strip()
with open("others_text.txt", "w") as f: 
    f.write(others_text)
f.close()


blank_mask = df['Gender'].isnull()
blank_objects = df.loc[blank_mask, 'Object_Recognized']
total_num_rows = blank_objects.shape[0]
selected_num_rows = int(total_num_rows * 0.5)
blank_subset = blank_objects.sample(n=selected_num_rows)
# print(blank_objects.head)
blank_subset = blank_subset.str.replace(',', '').str.replace('[','').str.replace(']','').str.replace("'",'')
blank_text = blank_subset.to_string(index=False, header=False).strip()
with open("blank_text.txt", "w") as f: 
    f.write(blank_text)
f.close()