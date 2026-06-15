import { useCardInspector } from './CardInspectorProvider';
import { useAppSelector } from '../../store/hooks';

import styles from './Inspector.module.css';

export default function Inspector() {
  const { inspectedId } = useCardInspector();

  const instance = useAppSelector((s) =>
    inspectedId ? s.board.cards[inspectedId] : undefined,
  );
  const definition = useAppSelector((s) =>
    instance ? s.board.cardDefs[instance.definitionId] : undefined,
  );

  if (!definition)
    return <aside className={styles.inspector}>Кликни на карту</aside>;

  //todo dfc добавить кнопку чтобы показывать обратную сторону
  //todo n2 нужна функция, которая преобразует условные символы в иконки
  return (
    <aside>
      <div className={styles.preview}>
        <img
          src={definition.imageURLS.large}
          alt={definition.name}
          className={styles.art}
        />
      </div>
      <h3>
        {definition.name} <small>{definition.manaCost}</small>
      </h3>
      <div className={styles.type}>{definition.typeLine}</div>
      <p className={styles.oracle}>{definition.oracleText}</p>
      {definition.power && (
        <div className={styles.pt}>
          {definition.power}/{definition.toughness}
        </div>
      )}
    </aside>
  );
}
