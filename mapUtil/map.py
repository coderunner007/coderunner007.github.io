if __name__ == '__main__':
    with open('map.txt') as file:
        data = file.read()
        svg_actions = data.strip().split('  ')

        moves = []

        for svg_action in svg_actions:
            action = svg_action[0]
            coords = map(lambda x: float(x) if x != '' else 0, svg_action[1:].split(','))

            moves.append({
                'action': action,
                'point': coords
            })

        print(moves)


