import styles from '../../styles/loading.module.scss'

interface Props {
    scale?: number
    size?: string;
}
export const Loading = ({scale, size}: Props) => {
  return (
    <div className={styles.ripple} style={{transform:`scale(${scale})`, width: size ? size : '80px', height: size ? size : '80px'}}>
      <div></div>
      <div></div>
    </div>
  );
};
